import React, { useEffect, useState } from "react";
import HeaderCards from "./HeaderCards";
import MintingHodlERG from "./MintingHodlERG";
import BurningHoldERG from "./BurningHoldERG";
import Loader from "./Loader";
import Navbar from "./Navbar";
import {
  BANK_SINGLETON_TOKEN_ID,
  explorerClient,
  isMainnet,
  precision,
  precisionBigInt,
  UIMultiplier,
} from "@/blockchain/ergo/constants";
import { HodlBankContract } from "@/blockchain/ergo/phoenixContracts/BankContracts/HodlBankContract";
import Footer from "./Footer";

interface HodlERGInterfaceData {
  currentPrice: string;
  circulatingSupply: string;
  tvl: string;
}

const Main = () => {
  const [ergdata, setErgData] = useState<HodlERGInterfaceData | null>(null);

  useEffect(() => {
    console.log(BANK_SINGLETON_TOKEN_ID(isMainnet));
    explorerClient(isMainnet)
      .getApiV1BoxesUnspentBytokenidP1(BANK_SINGLETON_TOKEN_ID(isMainnet))
      .then((res) => {
        const bankBox = res.data.items![0];
        const hodlBankContract = new HodlBankContract(bankBox);

        const currentPrice = hodlBankContract.mintAmount(BigInt(1e9));
        const tvl = hodlBankContract.getTVL();

        const currentPriceUI =
          Number((currentPrice * precisionBigInt) / UIMultiplier) / precision;

        const circulatingSupplyUI = (Number((hodlBankContract.getHodlERG3EmissionAmount() * precisionBigInt) / UIMultiplier) / precision)

        const tvlUI =
          Number((tvl * precisionBigInt) / UIMultiplier) / precision;

        setErgData({
          currentPrice: currentPriceUI.toString(),
          circulatingSupply: circulatingSupplyUI.toString(),
          tvl: tvlUI.toString(),
        });
      })
      .catch((err) => console.log(err));
  }, []);

  if (!ergdata) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-[70vh]">
        <div className="container mx-auto px-3 lg:px-5 my-10 sm:flex items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 xl:space-x-10">
          <HeaderCards
            title="Current price"
            text={`${ergdata.currentPrice} ERG`}
          />
          <HeaderCards
            title="Emission amount"
            text={`${ergdata.circulatingSupply} hodlERG`}
          />
          <HeaderCards title="TVL" text={`${ergdata.tvl} ERG`} />
        </div>
        <div className="lg:flex items-start px-3 my-10 lg:my-20">
          <MintingHodlERG />
          <BurningHoldERG />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Main;
