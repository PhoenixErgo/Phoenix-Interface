import React, { Fragment } from "react";
import MintingHodlERG from "./HodlErg3%/MintingHodlERG";
import BurningHoldERG from "./HodlErg3%/BurningHoldERG";
import HeaderCardsV2 from "../shared/HeaderCardsV2";
import MintingHodlERG10 from "./HodlErg10/MintingHodlERG10";
import BurningHoldERG10 from "./HodlErg10/BurningHodlERG10";
import {getTicker} from "@/common/utils";
import MintingHodlAlph from "@/components/Hodlerg/HodlAlph3/MintingHodlAlph";
import BurningHodlAlph from "@/components/Hodlerg/HodlAlph3/BurningHodlAlph";

interface IProps {
  gameData: any;
  network: string | null
}
const Hodlerg = (props: IProps) => {
  const { gameData, network } = props;

  function getNetworkComponent(network: string | null) {
    switch (network) {
      case '1':
      case '3':
      default:
        return (
            <Fragment>
              <MintingHodlERG network={network} />
              <BurningHodlErg network={network} />
            </Fragment>
        );
      case '4':
        return (
            <Fragment>
              <MintingHodlAlph network={network} />
              <BurningHodlAlph network={network} />
            </Fragment>
        );
    }
  }

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
                <div className="text-black mt-5 text-center text-2xl font-extrabold text-red-800">{`HODL${getTicker(network)} 3%`}</div>
                <HeaderCardsV2
                  title="Price"
                  amount={gameData.currentPrice}
                  token={getTicker(network)}
                />
                <HeaderCardsV2
                  title="Supply"
                  amount={gameData.circulatingSupply}
                  token={"hodl" + getTicker(network)}
                />
                <HeaderCardsV2
                  title="Reserve"
                  amount={gameData.tvl}
                  token={getTicker(network)}
                />
              </div>
              <div className="container mx-auto border lg:border-l-gray-300 flex flex-col items-center justify-between">
                <MintingHodlERG />
                <BurningHoldERG />
              </div>
            </div>
          </div>
          {!network || network === '1' ? <div className="max-w-l mx-auto font-inter my-10 mx-20">
            <div
                className="bg-gray-200 shadow-lg flex content-between rounded-md w-[350px] lg:w-[800px]  flex-col lg:flex-row p-2">
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
                <div className="text-black mt-5 text-center text-2xl font-extrabold text-red-800">{`HODL${getTicker(network)} 10%`}</div>
                <HeaderCardsV2
                    title="Price"
                    amount={gameData.currentPrice}
                    token={getTicker(network)}
                />
                <HeaderCardsV2
                    title="Supply"
                    amount={gameData.circulatingSupply}
                    token={"hodl" + getTicker(network)}
                />
                <HeaderCardsV2
                    title="Reserve"
                    amount={gameData.tvl}
                    token={getTicker(network)}
                />
              </div>
              <div className="container mx-auto border lg:border-l-gray-300 flex flex-col items-center justify-between">
                <MintingHodlERG10/>
                <BurningHoldERG10/>
              </div>
            </div>
          </div> : null }
        </div>
      </div>
    </>
  );
};

export default Hodlerg;
