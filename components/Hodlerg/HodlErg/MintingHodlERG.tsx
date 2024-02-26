import React, { useEffect, useState } from 'react';
import {
  BANK_SINGLETON_TOKEN_ID,
  explorerClient,
  HODL_ERG_TOKEN_ID,
  MIN_MINER_FEE,
  MIN_TX_OPERATOR_FEE,
  precision,
  precisionBigInt,
  PROXY_ADDRESS,
  UIMultiplier
} from '@/blockchain/ergo/constants';
import { OutputInfo } from '@/blockchain/ergo/explorerApi';
import { HodlBankContract } from '@/blockchain/ergo/phoenixContracts/BankContracts/HodlBankContract';
import { checkWalletConnection, signAndSubmitTx } from '@/blockchain/ergo/walletUtils/utils';
import { toast } from 'react-toastify';
import { noti_option, noti_option_close } from '@/components/Notifications/Toast';
import { ErgoAddress, OutputBuilder, SConstant, SLong, TransactionBuilder } from '@fleet-sdk/core';
import { hasDecimals, localStorageKeyExists } from '@/common/utils';
import { getInputBoxes, getShortLink, getWalletConfig } from '@/blockchain/ergo/wallet/utils';
import { getTxReducedB64Safe } from '@/blockchain/ergo/ergopay/reducedTxn';
import ErgoPayWalletModal from '@/components/wallet/ErgoPayWalletModal';

interface IProps {
  percent: string;
  network: string | null;
}

const MintingHodlERG = (props: IProps) => {
  const { network } = props;
  const isMainnet: boolean = !network || network === '1';

  const [mintAmount, setMintAmount] = useState<number>(0);
  const [bankBox, setBankBox] = useState<OutputInfo | null>(null);
  const [ergPrice, setErgPrice] = useState<number>(0);
  const [proxyAddress, setProxyAddress] = useState<string>('');

  const minBoxValue = BigInt(1000000);

  const [isModalErgoPayOpen, setIsModalErgoPayOpen] = useState<boolean>(false);
  const [ergoPayLink, setErgoPayLink] = useState<string>('');
  const [ergoPayTxId, setErgoPayTxId] = useState<string>('');

  useEffect(() => {
    setProxyAddress(PROXY_ADDRESS(isMainnet));
    explorerClient(isMainnet)
      .getApiV1BoxesUnspentBytokenidP1(BANK_SINGLETON_TOKEN_ID(isMainnet))
      .then((res) => {
        setBankBox(res.data.items![0] as OutputInfo);
      })
      .catch((err) => {
        toast.dismiss();
        toast.warn('error getting bank box', noti_option_close('try-again'));
        setBankBox(null);
      });
  }, []);

  useEffect(() => {
    if (!isNaN(mintAmount) && mintAmount >= 0.001 && !hasDecimals(mintAmount, 9) && bankBox) {
      const mintAmountBigInt = BigInt(mintAmount * 1e9);
      const hodlBankContract = new HodlBankContract(bankBox);
      const ep = hodlBankContract.mintAmount(mintAmountBigInt);
      setErgPrice(Number((ep * precisionBigInt) / UIMultiplier) / precision);
    } else {
      toast.dismiss();
      toast.warn('error calculating price', noti_option_close('try-again'));
      setErgPrice(0);
    }
  }, [mintAmount]);

  const handleClick = async () => {
    let txOperatorFee = BigInt(MIN_TX_OPERATOR_FEE);
    let minerFee = BigInt(MIN_MINER_FEE);

    const walletConfig = getWalletConfig();

    if (localStorageKeyExists('txOperatorFee')) {
      txOperatorFee = BigInt(localStorage.getItem('txOperatorFee')!);
    }

    if (localStorageKeyExists('minerFee')) {
      minerFee = BigInt(localStorage.getItem('minerFee')!);
    }

    if (mintAmount < 0.001) {
      toast.dismiss();
      toast.warn('min 0.001 ERG', noti_option_close('try-again'));
      return;
    }
    if (hasDecimals(mintAmount, 9)) {
      toast.dismiss();
      toast.warn('max 9 decimals', noti_option_close('try-again'));
      return;
    }

    if (!(await checkWalletConnection(walletConfig))) {
      toast.dismiss();
      toast.warn('please connect wallet', noti_option_close('try-again'));
      return;
    }

    if (!walletConfig) {
      toast.dismiss();
      toast.warn('issue with wallet', noti_option_close('try-again'));
      return;
    }

    const isErgoPay = walletConfig.walletName === 'ergopay';

    const txBuilding_noti = toast.loading('Please wait...', noti_option);

    const changeAddress = walletConfig.walletAddress[0];
    const creationHeight = (await explorerClient(isMainnet).getApiV1Blocks()).data.items![0].height;

    const mintAmountBigInt = BigInt(mintAmount * 1e9);
    const bankBoxRes = await explorerClient(isMainnet).getApiV1BoxesUnspentBytokenidP1(
      BANK_SINGLETON_TOKEN_ID(isMainnet)
    );
    const bankBox = bankBoxRes.data.items![0];
    const hodlBankContract = new HodlBankContract(bankBox);

    const nanoErgsPrice = hodlBankContract.mintAmount(mintAmountBigInt);

    const target = nanoErgsPrice + txOperatorFee + minerFee + minBoxValue;
    const targetWithfee = target + minerFee;

    const balance = isErgoPay
      ? (await explorerClient(isMainnet).getApiV1AddressesP1BalanceConfirmed(changeAddress)).data
          .nanoErgs
      : BigInt(await ergo!.get_balance());

    if (balance < targetWithfee) {
      toast.dismiss();
      toast.warn(
        `insufficient balance missing ${
          Number(((BigInt(targetWithfee) - BigInt(balance)) * precisionBigInt) / UIMultiplier) /
          precision
        } ERGs`,
        noti_option_close('try-again')
      );
      return;
    }

    const inputs = isErgoPay
      ? await getInputBoxes(explorerClient(isMainnet), changeAddress, targetWithfee)
      : await ergo!.get_utxos();

    let receiverErgoTree = ErgoAddress.fromBase58(String(changeAddress)).ergoTree;

    receiverErgoTree = receiverErgoTree.substring(2);

    const outBox = new OutputBuilder(target, proxyAddress).setAdditionalRegisters({
      R4: receiverErgoTree,
      R5: '0e20' + BANK_SINGLETON_TOKEN_ID(isMainnet),
      R6: '0e20' + HODL_ERG_TOKEN_ID(isMainnet),
      R7: SConstant(SLong(minBoxValue)),
      R8: SConstant(SLong(minerFee)),
      R9: SConstant(SLong(txOperatorFee))
    });

    try {
      const unsignedTransaction = new TransactionBuilder(creationHeight)
        .from(inputs) // add inputs
        .to(outBox)
        .sendChangeTo(changeAddress) // set change address
        .payFee(minerFee) // set fee
        .build()
        .toEIP12Object();

      if (isErgoPay) {
        const [txId, ergoPayTx] = await getTxReducedB64Safe(
          unsignedTransaction,
          explorerClient(isMainnet)
        );
        if (ergoPayTx === null) {
          toast.dismiss();
          toast.warn('issue getting ergopay transaction', noti_option_close('try-again'));
          return;
        }
        const url = await getShortLink(
          ergoPayTx,
          `Mint ${mintAmount} hodlERG3`,
          changeAddress,
          isMainnet
        );
        if (!url) {
          toast.dismiss();
          toast.warn('issue getting ergopay transaction', noti_option_close('try-again'));
          return;
        }
        console.log(url);
        setErgoPayTxId(txId!);
        setErgoPayLink(url);
        window.document.documentElement.classList.add('overflow-hidden');
        setIsModalErgoPayOpen(true);
        toast.dismiss();
        return;
      }

      signAndSubmitTx(unsignedTransaction, ergo, txBuilding_noti, isMainnet);
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.warn('issue building transaction', noti_option_close('try-again'));
      return;
    }
  };

  return (
    <article className="w-full h-1/2 mx-auto lg:mb-0 font-inter p-1">
      <div className="flex flex-col md:flex-row bg-gray-200 justify-start align-start md:justify-between rounded-md items-start md:items-center h-full">
        <div className="flex flex-col w-full h-full">
          <input
            className="h-1/2 w-full border-b-2 border-l-0 border-r-0 border-t-0 border-gray-300 bg-transparent text-gray-500 font-medium text-md h-14 focus:outline-none focus:ring-0 focus:border-primary focus-within:outline-none focus-within:shadow-none focus:shadow-none pl-4"
            placeholder="Amount"
            type="number"
            onChange={(event) => setMintAmount(parseFloat(event.target.value))}
          />
          <span className="text-black font-medium text-md pl-4 mt-2 h-1/2">
            {`${ergPrice} ERG`}
          </span>
        </div>

        <button
          className="h-full w-60 whitespace-nowrap focus:outline-none text-white primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300  focus:shadow-none font-medium rounded text-md px-5 py-2.5 w-full"
          onClick={handleClick}
        >
          MINT <br />
          HODLERG {`${props.percent}%`}
        </button>
        {isModalErgoPayOpen && (
          <ErgoPayWalletModal
            isModalOpen={isModalErgoPayOpen}
            setIsModalOpen={setIsModalErgoPayOpen}
            ergoPayLink={ergoPayLink}
            txid={ergoPayTxId}
            isMainnet={isMainnet}
          ></ErgoPayWalletModal>
        )}
      </div>
    </article>
  );
};

export default MintingHodlERG;
