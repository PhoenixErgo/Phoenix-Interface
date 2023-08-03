import React, { useEffect, useState } from "react";
import {
  Configuration,
  DefaultApiFactory,
  ItemsB,
  OutputInfo,
} from "@/blockchain/ergo/explorerApi";
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
import { HodlBankContract } from "@/blockchain/ergo/phoenixContracts/BankContracts/HodlBankContract";
import {
  getWalletConn,
  getWalletConnection,
  signAndSubmitTx,
} from "@/blockchain/ergo/walletUtils/utils";
import { toast } from "react-toastify";
import {
  noti_option,
  noti_option_close,
  txSubmmited,
} from "@/components/Notifications/Toast";
import {
  ErgoAddress,
  OutputBuilder,
  SConstant,
  SLong,
  TransactionBuilder,
} from "@fleet-sdk/core";
import { SignedTransaction } from "@fleet-sdk/common";

const BurningHoldERG = () => {
  const [burnAmount, setBurnAmount] = useState<number>(0);
  const [bankBox, setBankBox] = useState<OutputInfo | null>(null);
  const [ergPrice, setErgPrice] = useState<number>(0);

  useEffect(() => {
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
  }, []);

  const minBoxValue = BigInt(1000000);
  const minTxOperatorFee = BigInt(MIN_TX_OPERATOR_FEE);
  const minerFee = BigInt(1000000);
  const proxyAddress = PROXY_ADDRESS(isMainnet);

  useEffect(() => {
    if (!isNaN(burnAmount) && burnAmount >= 0.001 && bankBox) {
      const burnAmountBigInt = BigInt(burnAmount * 1e9);
      const hodlBankContract = new HodlBankContract(bankBox);
      const ep =
        hodlBankContract.burnAmount(burnAmountBigInt).expectedAmountWithdrawn;
      setErgPrice(Number((ep * precisionBigInt) / UIMultiplier) / precision);
    } else {
      toast.dismiss();
      toast.warn("error calculating price", noti_option_close("try-again"));
      setErgPrice(0);
    }
  }, [burnAmount]);

  const handleClick = async () => {
    if (burnAmount < 0.001) {
      toast.dismiss();
      toast.warn("min 0.001 ERG", noti_option_close("try-again"));
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

    const burnAmountBigInt = BigInt(burnAmount * 1e9);

    const outBox = new OutputBuilder(minTxOperatorFee + minerFee, proxyAddress)
      .addTokens({
        tokenId: HODL_ERG_TOKEN_ID(isMainnet),
        amount: burnAmountBigInt,
      })
      .setAdditionalRegisters({
        R4: receiverErgoTree,
        R5: "0e20" + BANK_SINGLETON_TOKEN_ID(isMainnet),
        R6: "0e20" + HODL_ERG_TOKEN_ID(isMainnet),
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
      <div className="max-w-md mx-auto">
        <h4 className="text-black text-xl font-medium">Burning hodlERG</h4>
        <p className="text-black my-3 min-h-[100px]">
          When burning your hodlERG, there is a 3% protocol fee and a 0.3% dev
          fee associated with the process. The protocol fee contributes to the
          overall dynamics of the ecosystem.
        </p>

        <div className="flex bg-gray-200 shadow-lg justify-between rounded-md items-start h-full">
          <div className="flex flex-col w-full h-full">
            <input
              className="w-full border-b-2 border-l-0 border-r-0 border-t-0 border-gray-300 bg-transparent text-gray-500 font-medium text-md h-14 focus:outline-none focus:ring-0 focus:border-primary focus-within:outline-none focus-within:shadow-none focus:shadow-none pl-4"
              placeholder="Amount"
              type="number"
              onChange={(event) =>
                setBurnAmount(parseFloat(event.target.value))
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
            BURN HODLERG
          </button>
        </div>
      </div>
    </>
  );
};

export default BurningHoldERG;
