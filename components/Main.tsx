import React, { useEffect, useState } from "react";
import HeaderCards from "./HeaderCards";
import { Logo } from "./Logo";
import MintingHodlERG from "./MintingHodlERG";
import BurningHoldERG from "./BurningHoldERG";
import Loader from "./Loader";
import {
    ItemsB
} from "@/blockchain/ergo/explorerApi";
import {
    BANK_SINGLETON_TOKEN_ID,
    EXPLORER_API_URL,
    explorerClient,
    isMainnet,
    precision,
    precisionBigInt,
    UIMultiplier,
} from "@/blockchain/ergo/constants";
import { HodlBankContract } from "@/blockchain/ergo/phoenixContracts/BankContracts/HodlBankContract";

interface HodlERGInterfaceData {
    currentPrice: string;
    circulatingSupply: string;
    tvl: string;
}

const Main = () => {
    const [ergdata, setErgData] = useState<HodlERGInterfaceData | null>(null);

    useEffect(() => {
        console.log(BANK_SINGLETON_TOKEN_ID);
        explorerClient(isMainnet)
            .getApiV1BoxesUnspentBytokenidP1(BANK_SINGLETON_TOKEN_ID)
            .then((res) => {
                const bankBox = res.data.items![0];
                const hodlBankContract = new HodlBankContract(bankBox);

                const currentPrice = hodlBankContract.mintAmount(BigInt(1e9));
                const circulatingSupply = hodlBankContract.getTotalTokenSupply();
                const tvl = hodlBankContract.getTVL();

                const currentPriceUI =
                    Number((currentPrice * precisionBigInt) / UIMultiplier) / precision;
                const circulatingSupplyUI =
                    Number((circulatingSupply * precisionBigInt) / UIMultiplier) /
                    precision;
                const tvlUI =
                    Number((tvl * precisionBigInt) / UIMultiplier) / precision;

                setErgData({
                    currentPrice: currentPriceUI.toString(),
                    circulatingSupply: circulatingSupplyUI.toString(),
                    tvl: tvlUI.toString(),
                });
            });
    }, []);

    if (!ergdata) {
        return <Loader />;
    }

    return (
        <>
            <div className="flex container items-center justify-between mx-auto px-3 lg:px-5 py-4">
                <Logo />
                <button
                    type="button"
                    className="focus:outline-none text-white primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300 font-medium rounded text-md px-3 sm:px-5 py-2 sm:py-2.5"
                >
                    CONNECT WALLET
                </button>
            </div>
            <div className="primary-gradient w-full py-3 text-center">
                <p className="border-bottom text-white font-medium text-lg uppercase relative after:absolute after:-bottom-[11px] after:left-1/2 after:-translate-x-1/2 after:w-[130%] after:bg-white after:h-1 inline-block">
                    HODLERG 3%
                </p>
            </div>
            <div className="container mx-auto px-3 lg:px-5 my-10 sm:flex items-center justify-between space-y-4 sm:space-x-4 xl:space-x-10">
                <HeaderCards
                    title="Current price"
                    text={`${ergdata.currentPrice} ERG`}
                />
                <HeaderCards
                    title="Circulating supply"
                    text={`${ergdata.circulatingSupply} hodlERG`}
                />
                <HeaderCards title="TVL" text={`${ergdata.tvl} ERG`} />
            </div>
            <div className="lg:flex items-center px-3 my-10 lg:my-20">
                <MintingHodlERG />
                <BurningHoldERG />
            </div>
        </>
    );
};

export default Main;