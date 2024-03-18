import React from 'react';
import MintingHodlTOKEN from '@/components/Hodltoken/ui/MintingHodlTOKEN';
import BurningHoldTOKEN from '@/components/Hodltoken/ui/BurningHodlTOKEN';
import DepositingHoldTOKEN from '@/components/Hodltoken/ui/DepositingHodlTOKEN';
import { useAdvancedSettings } from '@/context/AdvansedSettings';

interface TopItemProps {
  title: string;
  bankFee: number;
  token: string;
  amount: number;
}

const TopItem: React.FC<TopItemProps> = ({ title, bankFee, token, amount }) => {
  const { advancedSettings } = useAdvancedSettings();

  return (
    // <div >
    <div
      className="bg-gray-200 shadow-lg flex content-between rounded-md w-[350px] flex-col"
      style={{ margin: '0 auto' }}
    >
      <div className="container mx-auto flex flex-col justify-between w-[350px] ">
        <div className="text-black mt-5 text-center text-2xl font-extrabold text-red-800 ">
          {title} {bankFee}%
        </div>
        <article className="text-start w-full bg-gray-200 p-3 font-inter flex items-center justify-between">
          <div className=" text-black text-sm">Price</div>
          <div className="flex flex-col items-end">
            <span className="font-bold text-base lg:text-lg text-black pr-1">123{amount} </span>
            <span className="font-thin lg:text-s text-black pr-1">{token}</span>
          </div>
        </article>
        <article className="text-start w-full bg-gray-200 p-3 font-inter flex items-center justify-between">
          <div className=" text-black text-sm">Supply</div>
          <div className="flex flex-col items-end">
            <span className="font-bold text-base lg:text-lg text-black pr-1">{amount} </span>
            <span className="font-thin lg:text-s text-black pr-1">{token}</span>
          </div>
        </article>
        <article className="text-start w-full bg-gray-200 p-3 font-inter flex items-center justify-between">
          <div className=" text-black text-sm">Reserve</div>
          <div className="flex flex-col items-end">
            <span className="font-bold text-base lg:text-lg text-black pr-1">{amount} </span>
            <span className="font-thin lg:text-s text-black pr-1">{token}</span>
          </div>
        </article>
      </div>
      <div className="container mx-auto border flex flex-col items-center justify-around">
        <MintingHodlTOKEN token={token} />
        <BurningHoldTOKEN token={`hodl${token}`} />
        {advancedSettings && <DepositingHoldTOKEN token={token} />}
      </div>
    </div>
    // </div>
  );
};

export default TopItem;
