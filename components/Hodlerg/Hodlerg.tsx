import React from "react";
import HeaderCards from "../HeaderCards";
import MintingHodlERG from "./HodlErg3%/MintingHodlERG";
import BurningHoldERG from "./HodlErg3%/BurningHoldERG";
import HeaderCardsV2 from "../HeaderCardsV2";
import MintingHodlERG10 from "./HodlErg10/MintingHodlERG10";
import BurningHoldERG10 from "./HodlErg10/BurningHodlERG10";

interface IProps {
  ergdata: any;
}
const Hodlerg = (props: IProps) => {
  const { ergdata } = props;

  return (
    <>
      <div className="min-h-[70vh] flex flex-col  md:mx-20 mx-5">
        <h2 className="text-black font-bold text-3xl my-10 lg:mb-8 text-center">HODLERG</h2>
        <div className="mt-8">
          <HeaderCardsV2
            title="Current price"
            text={`${ergdata.currentPrice} ERG`}
          />
          <HeaderCardsV2
            title="Emission amount"
            text={`${ergdata.circulatingSupply} hodlERG`}
          />
          <HeaderCardsV2
            title="TVL"
            text={`${ergdata.tvl} ERG`}
          />
        </div>
        <div className="flex">
          <div className="w-full flex flex-col items-center px-2 sm:px-3 my-10  lg:my-20">
            <h2 className="text-black font-bold text-3xl mb-5 lg:mb-8">HODLERG 3%</h2>
            <MintingHodlERG />
            <BurningHoldERG />
          </div>

          <div className="w-full flex flex-col items-center px-2 sm:px-3 my-10 lg:my-20">
            <h2 className="text-black font-bold text-3xl mb-5 lg:mb-8">HODLERG 10%</h2>
            <MintingHodlERG10 />
            <BurningHoldERG10 />
          </div>
        </div>

      </div>
    </>
  );
};

export default Hodlerg;
