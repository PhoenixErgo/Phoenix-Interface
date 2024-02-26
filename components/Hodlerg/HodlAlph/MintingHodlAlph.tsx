import React, { useEffect, useState } from "react";
import { HodlBankContract } from "@/blockchain/alephium/phoenixContracts/BankContracts/HodlBankContract";
import { toast } from "react-toastify";
import {
  ALPHTxSubmitted,
  noti_option,
  noti_option_close,
} from "@/components/Notifications/Toast";
import {convertBigToBigInt, formatBigIntWithDecimalsRounded, hasDecimals} from "@/common/utils";
import {useWallet} from "@alephium/web3-react";
import {addressFromContractId, ALPH_TOKEN_ID, DUST_AMOUNT, ONE_ALPH} from "@alephium/web3";
import {mint} from "@/blockchain/alephium/services/mint.service";
import Big from "big.js";
import {HODL_ALPH_UI_FEE, HODL_TOKEN_UI_FEE} from "@/blockchain/alephium/constants";

interface IProps {
  percent: string;
  baseTokenTicker: string;
  baseTokenId: string;
  contractId: string;
  decimals: number;
  network: string | null;
}

const MintingHodlAlph = (props: IProps) => {

  const { network, contractId, baseTokenId, decimals } = props;

  const { signer, account } = useWallet();

  const [mintAmount, setMintAmount] = useState<number>(0);
  const [ALPHUIprice, setALPHUIPrice] = useState<string>('0');
  const [ALPHPrice, setALPHPrice] = useState<bigint>(BigInt(0));

  const contractAddress = addressFromContractId(contractId);

  useEffect(() => {
    if (
      !isNaN(mintAmount) &&
      mintAmount >= 0.001 &&
      !hasDecimals(mintAmount, decimals)
    ) {
      const bigNum = new Big(mintAmount);
      const shiftedNum = bigNum.times(new Big(10).pow(decimals));
      const mintAmountBigInt = convertBigToBigInt(shiftedNum);
      const hodlBankContract = new HodlBankContract(contractAddress, network);
      hodlBankContract.mintAmount(mintAmountBigInt).then(ep => {
        console.log(ep)
        setALPHPrice(ep);
        setALPHUIPrice(formatBigIntWithDecimalsRounded(ep, decimals, 3));
      })
    } else {
      toast.dismiss();
      toast.warn("error calculating price", noti_option_close("try-again"));
      setALPHUIPrice('0');
    }
  }, [mintAmount]);

  const handleClick = async () => {
    const minAmount = baseTokenId === ALPH_TOKEN_ID ? DUST_AMOUNT : BigInt(1)
    const minValue = parseFloat(formatBigIntWithDecimalsRounded(minAmount, decimals, decimals));
    if (mintAmount < minValue) {
      toast.dismiss();
      toast.warn(`min ${minValue} ALPH`, noti_option_close("try-again"));
      return;
    }

    if (hasDecimals(mintAmount, decimals)) {
      toast.dismiss();
      toast.warn(`max ${decimals} decimals`, noti_option_close("try-again"));
      return;
    }

    const bigNum = new Big(mintAmount);
    const shiftedNum = bigNum.times(new Big(10).pow(decimals));
    const mintAmountBigInt = convertBigToBigInt(shiftedNum);

    if(signer){
      const txBuilding_noti = toast.loading("please wait...", noti_option);
      toast.update(txBuilding_noti, {
        render: 'Sign your transaction',
        type: 'success',
        isLoading: false,
        autoClose: false,
      });
      let result;
      try{
        if(baseTokenId === ALPH_TOKEN_ID){
          result = await mint(signer, contractId, mintAmountBigInt, ALPH_TOKEN_ID, ALPHPrice + DUST_AMOUNT, HODL_ALPH_UI_FEE(ALPHPrice))
        } else {
          result = await mint(signer, contractId, mintAmountBigInt, baseTokenId, ALPHPrice, HODL_TOKEN_UI_FEE)
        }
      } catch (error){
        toast.dismiss();
        toast.warn('issue signing tx', noti_option_close('try-again'));
        return;
      }
      toast.dismiss();
      ALPHTxSubmitted(result.txId, network);
      console.log(JSON.stringify(result, null, 2))
    } else {
      toast.dismiss();
      toast.warn("please connect wallet", noti_option_close("try-again"));
    }
    return;
  };

  return (

      <article className="w-full h-1/2 mx-auto lg:mb-0 font-inter p-1">
        <div className="flex flex-col md:flex-row bg-gray-200 justify-start align-start md:justify-between rounded-md items-start md:items-center h-full">
          <div className="flex flex-col w-full h-full">
            <input
                className="h-1/2 w-full border-b-2 border-l-0 border-r-0 border-t-0 border-gray-300 bg-transparent text-gray-500 font-medium text-md h-14 focus:outline-none focus:ring-0 focus:border-primary focus-within:outline-none focus-within:shadow-none focus:shadow-none pl-4"
                placeholder="Amount"
                type="number"
                onChange={(event) =>
                    setMintAmount(parseFloat(event.target.value))
                }
            />
            <span className="text-black font-medium text-md pl-4 mt-2 h-1/2">
            {`${ALPHUIprice} ${props.baseTokenTicker}`}
          </span>
          </div>

          <button
              className="h-full w-60 whitespace-nowrap focus:outline-none text-white primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300  focus:shadow-none font-medium rounded text-md px-5 py-2.5 w-full"
              onClick={handleClick}
          >
            MINT <br />HODL{`${props.baseTokenTicker} ${props.percent}%`}
          </button>
        </div>
      </article>

  );
};

export default MintingHodlAlph;
