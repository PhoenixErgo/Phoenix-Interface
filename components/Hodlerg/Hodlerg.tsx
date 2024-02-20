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
      <div className="min-h-[70vh] flex flex-col  md:mx-20 mx-5 items-center">
        <div className="w-full lg:w-[800px] flex flex-col items-center px-2 sm:px-3 my-2 lg:my-10 justify-center">
          <div className="max-w-l mx-auto font-inter my-10 mx-20">
            <div className="bg-gray-200 shadow-lg flex content-between rounded-md w-[350px] lg:w-[800px]  flex-col lg:flex-row p-2">
              {/* <p className="text-black my-3 min-h-[100px] flex items-end">
                    Mint hodlERG with no fees. You have the freedom to mint as much as you
                    desire at the current price. It's important to note that the minting
                    process does not directly affect the token's pricing dynamics.
                  </p> */}
              {/* <p className="text-black my-3 min-h-[100px] flex items-end">
                    When burning your hodlERG, there is a 3% protocol fee and a 0.3% dev
                    fee associated with the process. The protocol fee contributes to the
                    overall dynamics of the ecosystem.
                  </p> */}
              <div className="container mx-auto flex flex-col justify-between">
                <div className="text-black mt-5 text-center text-2xl font-extrabold text-red-800">HODLERG 3%</div>
                <HeaderCardsV2
                  title="Price"
                  amount={ergdata.currentPrice}
                  token="ERG"
                />
                <HeaderCardsV2
                  title="Supply"
                  amount={ergdata.circulatingSupply}
                  token="hodlERG"
                />
                <HeaderCardsV2
                  title="Reserve"
                  amount={ergdata.tvl}
                  token="ERG"
                />
              </div>
              <div className="container mx-auto border border-l-gray-300 flex flex-col items-center justify-between">
                <MintingHodlERG />
                <BurningHoldERG />
              </div>
            </div>
          </div>
          <div className="max-w-l mx-auto font-inter my-10 mx-20">
            <div className="bg-gray-200 shadow-lg flex content-between rounded-md w-[350px] lg:w-[800px]  flex-col lg:flex-row p-2">
              {/* <p className="text-black my-3 min-h-[100px] flex items-end">
                    Mint hodlERG with no fees. You have the freedom to mint as much as you
                    desire at the current price. It's important to note that the minting
                    process does not directly affect the token's pricing dynamics.
                  </p> */}
              {/* <p className="text-black my-3 min-h-[100px] flex items-end">
                    When burning your hodlERG, there is a 3% protocol fee and a 0.3% dev
                    fee associated with the process. The protocol fee contributes to the
                    overall dynamics of the ecosystem.
                  </p> */}
              <div className="container mx-auto flex flex-col justify-between">
                <div className="text-black mt-5 text-center text-2xl font-extrabold text-red-800">HODLERG 10%</div>
                <HeaderCardsV2
                  title="Price"
                  amount={ergdata.currentPrice}
                  token="ERG"
                />
                <HeaderCardsV2
                  title="Supply"
                  amount={ergdata.circulatingSupply}
                  token="hodlERG"
                />
                <HeaderCardsV2
                  title="Reserve"
                  amount={ergdata.tvl}
                  token="ERG"
                />
              </div>
              <div className="container mx-auto border border-l-gray-300 flex flex-col items-center justify-between">
                <MintingHodlERG10 />
                <BurningHoldERG10 />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hodlerg;
