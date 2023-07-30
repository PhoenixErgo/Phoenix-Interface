import React, { useEffect, useState } from "react";
import {
  BANK_SINGLETON_TOKEN_ID,
  explorerClient,
  HODL_ERG_TOKEN_ID,
  isMainnet,
  MIN_TX_OPERATOR_FEE,
  precision,
  precisionBigInt,
  PROXY_ADDRESS,
  UIMultiplier,
} from "@/blockchain/ergo/constants";
import {
  OutputInfo
} from "@/blockchain/ergo/explorerApi";
import { HodlBankContract } from "@/blockchain/ergo/phoenixContracts/BankContracts/HodlBankContract";
import {
  getWalletConn,
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

const MintingHodlERG = () => {
  const [mintAmount, setMintAmount] = useState<number>(0);
  const [bankBox, setBankBox] = useState<OutputInfo | null>(null);
  const [ergPrice, setErgPrice] = useState<number>(0);

  const minBoxValue = BigInt(1000000);
  const minTxOperatorFee = BigInt(MIN_TX_OPERATOR_FEE);
  const minerFee = BigInt(1000000);
  const proxyAddress = PROXY_ADDRESS(isMainnet);

  useEffect(() => {
    explorerClient(isMainnet)
        .getApiV1BoxesUnspentBytokenidP1(BANK_SINGLETON_TOKEN_ID)
        .then((res) => {
          setBankBox(res.data.items![0] as OutputInfo);
        })
        .catch((err) => setBankBox(null));
  }, []);

  useEffect(() => {
    if (!isNaN(mintAmount) && bankBox) {
      const mintAmountBigInt = BigInt(mintAmount * 1e9);
      const hodlBankContract = new HodlBankContract(bankBox);
      const ep = hodlBankContract.mintAmount(mintAmountBigInt);
      setErgPrice(Number((ep * precisionBigInt) / UIMultiplier) / precision);
    } else {
      setErgPrice(0);
    }
  }, [mintAmount]);

  const handleClick = async () => {
    if (mintAmount <= 0) {
      return;
    }
    if (!(await getWalletConn())) {
      return;
    }
    const txBuilding_noti = toast.loading("Please wait...", noti_option);

    const inputs = await ergo!.get_utxos();
    const changeAddress = await ergo!.get_change_address();
    const creationHeight = await ergo!.get_current_height();

    let receiverErgoTree = ErgoAddress.fromBase58(
        String(changeAddress)
    ).ergoTree;

    receiverErgoTree = receiverErgoTree.substring(2);

    const mintAmountBigInt = BigInt(mintAmount);
    const bankBoxRes = await explorerClient(
        isMainnet
    ).getApiV1BoxesUnspentBytokenidP1(BANK_SINGLETON_TOKEN_ID);
    const bankBox = bankBoxRes.data.items![0];
    const hodlBankContract = new HodlBankContract(bankBox);

    const nanoErgsPrice = hodlBankContract.mintAmount(
        mintAmountBigInt * UIMultiplier
    );

    const outBox = new OutputBuilder(
        nanoErgsPrice + minTxOperatorFee + minerFee,
        proxyAddress
    ).setAdditionalRegisters({
      R4: receiverErgoTree,
      R5: "0e20" + BANK_SINGLETON_TOKEN_ID,
      R6: "0e20" + HODL_ERG_TOKEN_ID,
      R7: SConstant(SLong(minBoxValue)),
      R8: SConstant(SLong(minerFee)),
    });

    try {
      const unsignedTransaction = new TransactionBuilder(creationHeight)
          .from(inputs) // add inputs
          .to(outBox)
          .sendChangeTo(changeAddress) // set change address
          .payFee(minerFee) // set fee
          .build()
          .toEIP12Object();

      signAndSubmitTx(unsignedTransaction, ergo, txBuilding_noti);
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.warn("issue building transaction", noti_option_close("try-again"));
      return;
    }
  };

  return (
      <>
        <div className="max-w-md mx-auto mb-10 lg:mb-0">
          <h4 className="text-black text-xl font-medium">Minting hodlERG</h4>
          <p className="text-black my-3">
            Mint hodlERG with no fees. You have the freedom to mint as much as you
            desire at the current price. it's important to note that the minting
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
              {`${ergPrice} ERG`}
            </span>
            </div>

            <button
                className="h-24 whitespace-nowrap focus:outline-none text-white primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300  focus:shadow-none font-medium rounded text-md px-5 py-2.5"
                onClick={handleClick}
            >
              MINT HODLERG
            </button>
          </div>
        </div>
      </>
  );
};

export default MintingHodlERG;