import React, { useEffect, useState } from 'react';
import { HodlBankContract } from '@/blockchain/alephium/phoenixContracts/BankContracts/HodlBankContract';
import { toast } from 'react-toastify';
import { ALPHTxSubmitted, noti_option, noti_option_close } from '@/components/Notifications/Toast';
import { convertBigToBigInt, formatBigIntWithDecimalsRounded, hasDecimals } from '@/common/utils';
import { useWallet } from '@alephium/web3-react';
import { burn } from '@/blockchain/alephium/services/burn.service';
import { addressFromContractId, ALPH_TOKEN_ID, DUST_AMOUNT } from '@alephium/web3';
import Big from 'big.js';
import { HODL_ALPH_UI_FEE } from '@/blockchain/alephium/constants';
interface IProps {
  percent: string;
  baseTokenTicker: string;
  baseTokenId: string;
  contractId: string;
  decimals: number;
  network: string | null;
}

const BurningHodlAlph = (props: IProps) => {
  const { network, contractId, baseTokenId, decimals } = props;

  const { signer, account } = useWallet();

  const [burnAmount, setBurnAmount] = useState<number>(0);
  const [ALPHUIPrice, setALPHUIPrice] = useState<string>('0');

  const minAmount = baseTokenId === ALPH_TOKEN_ID ? DUST_AMOUNT : BigInt(1);
  const minValue = parseFloat(formatBigIntWithDecimalsRounded(minAmount, decimals, decimals));

  const contractAddress = addressFromContractId(contractId);

  useEffect(() => {
    if (!isNaN(burnAmount) && !hasDecimals(burnAmount, decimals)) {
      const bigNum = new Big(burnAmount);
      const shiftedNum = bigNum.times(new Big(10).pow(decimals));
      const burnAmountBigInt = convertBigToBigInt(shiftedNum);
      const hodlBankContract = new HodlBankContract(contractAddress, network);
      hodlBankContract.burnAmount(burnAmountBigInt).then((ep) => {
        setALPHUIPrice(formatBigIntWithDecimalsRounded(ep.expectedAmountWithdrawn, decimals, 3));
      });
    } else {
      toast.dismiss();
      toast.warn('error calculating price', noti_option_close('try-again'));
      setALPHUIPrice('0');
    }
    {/* eslint-disable-next-line */ }
  }, [burnAmount]);

  const handleClick = async () => {
    if(!burnAmount || burnAmount === 0){
      toast.dismiss();
      toast.warn(`enter amount greater than zero`, noti_option_close('try-again'));
      return;
    }
    if (hasDecimals(burnAmount, decimals)) {
      toast.dismiss();
      toast.warn(`max ${decimals} decimals`, noti_option_close('try-again'));
      return;
    }

    const bigNum = new Big(burnAmount);
    const shiftedNum = bigNum.times(new Big(10).pow(decimals));
    const burnAmountBigInt = convertBigToBigInt(shiftedNum);

    if (signer) {
      const txBuilding_noti = toast.loading('please wait...', noti_option);
      toast.update(txBuilding_noti, {
        render: 'Sign your transaction',
        type: 'success',
        isLoading: false,
        autoClose: false
      });
      let result;
      try {
        result = await burn(
          signer,
          contractId,
          burnAmountBigInt,
          HODL_ALPH_UI_FEE(burnAmountBigInt)
        );
      } catch (error) {
        toast.dismiss();
        toast.warn('issue signing tx', noti_option_close('try-again'));
        return;
      }
      toast.dismiss();
      ALPHTxSubmitted(result.txId, network);
      console.log(JSON.stringify(result, null, 2));
    } else {
      toast.dismiss();
      toast.warn('please connect wallet', noti_option_close('try-again'));
    }
    return;
  };

  return (
    <>
      <article className="w-full mx-auto font-inter h-1/2 p-1">
        <div className="flex flex-col md:flex-row bg-gray-200 justify-start align-start md:justify-between rounded-md items-start md:items-center h-full">
          <div className="flex flex-col w-full h-full">
            <input
              className="h-1/2 w-full border-b-2 border-l-0 border-r-0 border-t-0 border-gray-300 bg-transparent text-gray-500 font-medium text-md h-14 focus:outline-none focus:ring-0 focus:border-primary focus-within:outline-none focus-within:shadow-none focus:shadow-none pl-4"
              placeholder="Amount"
              type="number"
              onChange={(event) => setBurnAmount(parseFloat(event.target.value))}
            />
            <span className="text-black font-medium text-md pl-4 mt-2 h-1/2">
              {`${ALPHUIPrice} ${props.baseTokenTicker} + UI Fee`}
            </span>
          </div>

          <button
            className="h-full w-60 whitespace-nowrap focus:outline-none text-white primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300  focus:shadow-none font-medium rounded text-md px-5 py-2.5 w-full"
            onClick={handleClick}
          >
            BURN <br />
            HODL{`${props.baseTokenTicker} ${props.percent}%`}
          </button>
        </div>
      </article>
    </>
  );
};

export default BurningHodlAlph;
