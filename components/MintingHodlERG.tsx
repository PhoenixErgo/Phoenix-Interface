import React, { useEffect, useState } from "react";
import {
  BANK_SINGLETON_TOKEN_ID, BASE_TOKEN_ID,
  explorerClient,
  HODL_ERG_TOKEN_ID,
  MIN_MINER_FEE,
  MIN_TX_OPERATOR_FEE,
  PROXY_ADDRESS,
} from "@/blockchain/ergo/constants";
import { OutputInfo } from "@/blockchain/ergo/explorerApi";
import {
  checkWalletConnection,
  signAndSubmitTx,
} from "@/blockchain/ergo/walletUtils/utils";
import { toast } from "react-toastify";
import {
  noti_option,
  noti_option_close,
} from "@/components/Notifications/Toast";
import {
  ErgoAddress,
  OutputBuilder,
  SConstant,
  SLong,
  TransactionBuilder,
} from "@fleet-sdk/core";
import { hasDecimals, localStorageKeyExists } from "@/common/utils";
import {getInputBoxes, getShortLink, getWalletConfig} from "@/blockchain/ergo/wallet/utils";
import assert from "assert";
import { getTxReducedB64Safe } from "@/blockchain/ergo/ergopay/reducedTxn";
import ErgoPayWalletModal from "@/components/wallet/ErgoPayWalletModal";
import {HodlTokenContract} from "@/blockchain/ergo/phoenixContracts/BankContracts/HodlTokenContract";

const MintingHodlERG = () => {
  const [isMainnet, setIsMainnet] = useState<boolean>(true);
  const [mintAmount, setMintAmount] = useState<number>(0);
  const [bankBox, setBankBox] = useState<OutputInfo | null>(null);
  const [baseTokenDecimal, setBaseTokenDecimal] = useState<number | undefined>(undefined);
  const [ergPrice, setErgPrice] = useState<number>(0);
  const [proxyAddress, setProxyAddress] = useState<string>("");

  const minBoxValue = BigInt(1000000);

  const [isModalErgoPayOpen, setIsModalErgoPayOpen] = useState<boolean>(false);
  const [ergoPayLink, setErgoPayLink] = useState<string>("");
  const [ergoPayTxId, setErgoPayTxId] = useState<string>("");

  useEffect(() => {
    const isMainnet = localStorage.getItem("IsMainnet")
      ? (JSON.parse(localStorage.getItem("IsMainnet")!) as boolean)
      : true;

    setIsMainnet(isMainnet);
    setProxyAddress(PROXY_ADDRESS(isMainnet));

    explorerClient(isMainnet)
      .getApiV1BoxesUnspentBytokenidP1(BANK_SINGLETON_TOKEN_ID(isMainnet))
      .then((res) => {
        setBankBox(res.data.items![0] as OutputInfo);
      })
      .catch((err) => {
        toast.dismiss();
        toast.warn("error getting bank box", noti_option_close("try-again"));
        setBankBox(null);
      });

    explorerClient(isMainnet)
        .getApiV1TokensP1(BASE_TOKEN_ID(isMainnet))
        .then((res) => {
          console.log(res.data.decimals);
          setBaseTokenDecimal(res.data.decimals)
        })
        .catch((err) => {
          console.log(err);
          toast.dismiss();
          toast.warn("error getting base token decimals", noti_option_close("try-again"));
          setBaseTokenDecimal(undefined);
        });
  }, []);

  useEffect(() => {
    if (
      !isNaN(mintAmount) && (baseTokenDecimal !== undefined) &&
      !hasDecimals(mintAmount * Math.pow(10, baseTokenDecimal)) &&
      bankBox
    ) {
      const baseTokenSingleUnit =  Math.pow(10, baseTokenDecimal);
      const mintAmountBigInt = BigInt(mintAmount * baseTokenSingleUnit);
      const hodlBankContract = new HodlTokenContract(bankBox);
      const ep = hodlBankContract.mintAmount(mintAmountBigInt);
      const precisionBigInt = BigInt(baseTokenSingleUnit);
      const UIMultiplier = BigInt(baseTokenSingleUnit);
      const precision = baseTokenSingleUnit;
      setErgPrice(Number((ep * precisionBigInt) / UIMultiplier) / precision);
    } else {
      toast.dismiss();
      toast.warn("error calculating price", noti_option_close("try-again"));
      setErgPrice(0);
    }
  }, [mintAmount]);

  const handleClick = async () => {
    let txOperatorFee = BigInt(MIN_TX_OPERATOR_FEE);
    let minerFee = BigInt(MIN_MINER_FEE);

    if(baseTokenDecimal === undefined){
      toast.dismiss();
      toast.warn("error getting base token decimals", noti_option_close("try-again"));
      return;
    }

    const baseTokenSingleUnit =  Math.pow(10, baseTokenDecimal);

    if (hasDecimals(mintAmount * baseTokenSingleUnit)) {
      toast.dismiss();
      toast.warn("decimals exceeded", noti_option_close("try-again"));
      return;
    }

    const mintAmountBigInt = BigInt(mintAmount * baseTokenSingleUnit);

    const walletConfig = getWalletConfig();

    if (localStorageKeyExists("txOperatorFee")) {
      txOperatorFee = BigInt(localStorage.getItem("txOperatorFee")!);
    }

    if (localStorageKeyExists("minerFee")) {
      minerFee = BigInt(localStorage.getItem("minerFee")!);
    }

    if (mintAmountBigInt <= BigInt(0)) {
      toast.dismiss();
      toast.warn("at least one unit required", noti_option_close("try-again"));
      return;
    }

    if (!(await checkWalletConnection(walletConfig))) {
      toast.dismiss();
      toast.warn("please connect wallet", noti_option_close("try-again"));
      return;
    }

    assert(walletConfig !== undefined);

    const isErgoPay = walletConfig.walletName === "ergopay";

    const txBuilding_noti = toast.loading("Please wait...", noti_option);

    const changeAddress = walletConfig.walletAddress[0];
    const creationHeight = (await explorerClient(isMainnet).getApiV1Blocks())
      .data.items![0].height;


    const bankBoxRes = await explorerClient(
        isMainnet
    ).getApiV1BoxesUnspentBytokenidP1(BANK_SINGLETON_TOKEN_ID(isMainnet));
    const bankBox = bankBoxRes.data.items![0];
    const hodlBankContract = new HodlTokenContract(bankBox);
    const tokensToSend = hodlBankContract.mintAmount(mintAmountBigInt);

    const target = minBoxValue + txOperatorFee + minerFee;
    const targetWithfee = target + minerFee;

    const tokens = [{
      tokenId: BASE_TOKEN_ID(isMainnet),
      amount: tokensToSend
    }]

    const precisionBigInt = BigInt(baseTokenSingleUnit);
    const UIMultiplier = BigInt(baseTokenSingleUnit);
    const precision = baseTokenSingleUnit;

    const balance = isErgoPay ? (await explorerClient(isMainnet).getApiV1AddressesP1BalanceConfirmed(changeAddress)).data.nanoErgs : BigInt(await ergo!.get_balance());

    if (balance < targetWithfee){
      toast.dismiss();
      toast.warn(`insufficient balance missing ${Number(((BigInt(targetWithfee) - BigInt(balance)) * precisionBigInt) / UIMultiplier) / precision} ERGs`, noti_option_close("try-again"));
      return;
    }

    const tokenBalance = isErgoPay ? (await explorerClient(isMainnet).getApiV1AddressesP1BalanceConfirmed(changeAddress)).data.tokens!.filter(t => t.tokenId === BASE_TOKEN_ID(isMainnet))[0].amount : BigInt(await ergo!.get_balance(HODL_ERG_TOKEN_ID(isMainnet)));

    if (tokenBalance < tokensToSend){
      toast.dismiss();
      toast.warn(`insufficient token balance missing ${Number(((BigInt(tokensToSend) - BigInt(tokenBalance)) * precisionBigInt) / UIMultiplier) / precision} comet`, noti_option_close("try-again"));
      return;
    }


    const inputs = isErgoPay
      ? await getInputBoxes(explorerClient(isMainnet), changeAddress, targetWithfee, tokens)
      : await ergo!.get_utxos();

    let receiverErgoTree = ErgoAddress.fromBase58(
      String(changeAddress)
    ).ergoTree;

    receiverErgoTree = receiverErgoTree.substring(2);

    const outBox = new OutputBuilder(
        target,
      proxyAddress
    ).setAdditionalRegisters({
      R4: receiverErgoTree,
      R5: "0e20" + BANK_SINGLETON_TOKEN_ID(isMainnet),
      R6: "0e20" + HODL_ERG_TOKEN_ID(isMainnet),
      R7: SConstant(SLong(minBoxValue)),
      R8: SConstant(SLong(minerFee)),
      R9: SConstant(SLong(txOperatorFee)),
    }).addTokens(tokens);

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
          toast.warn(
            "issue getting ergopay transaction",
            noti_option_close("try-again")
          );
          return;
        }
        const url = await getShortLink(ergoPayTx, `Mint ${mintAmount} hodlERG3`, changeAddress, isMainnet);
        if (!url) {
          toast.dismiss();
          toast.warn(
            "issue getting ergopay transaction",
            noti_option_close("try-again")
          );
          return;
        }
        console.log(url);
        setErgoPayTxId(txId!);
        setErgoPayLink(url);
        window.document.documentElement.classList.add("overflow-hidden");
        setIsModalErgoPayOpen(true);
        toast.dismiss();
        return;
      }

      signAndSubmitTx(unsignedTransaction, ergo, txBuilding_noti, isMainnet);
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.warn("issue building transaction", noti_option_close("try-again"));
      return;
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto mb-10 lg:mb-0 font-inter">
        <h4 className="text-black text-xl font-medium">Minting hodlCOMET</h4>
        <p className="text-black my-3 min-h-[100px]">
          Mint hodlCOMET with no fees. You have the freedom to mint as much as you
          desire at the current price. It's important to note that the minting
          process does not directly affect the token's pricing dynamics.
        </p>

        <div className="flex bg-gray-200 shadow-lg justify-between rounded-md items-start h-full">
          <div className="flex flex-col w-full h-full">
            <input
              className="w-full border-b-2 border-l-0 border-r-0 border-t-0 border-gray-300 bg-transparent text-gray-500 font-medium text-md h-14 focus:outline-none focus:ring-0 focus:border-primary focus-within:outline-none focus-within:shadow-none focus:shadow-none pl-4"
              placeholder="Amount"
              type="number"
              onChange={(event) =>
                setMintAmount(parseFloat(event.target.value))
              }
            />
            <span className="text-black font-medium text-md pl-4 mt-2">
              {`${ergPrice} Comet`}
            </span>
          </div>

          <button
            className="h-24 whitespace-nowrap focus:outline-none text-white primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300  focus:shadow-none font-medium rounded text-md px-5 py-2.5"
            onClick={handleClick}
          >
            MINT HODLCOMET
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
      </div>
    </>
  );
};

export default MintingHodlERG;
