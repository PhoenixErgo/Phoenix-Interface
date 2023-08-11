import React, { useContext, useEffect, useState } from "react";
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
} from "../blockchain/ergo/constants";
import { HodlBankContract } from "../blockchain/ergo/phoenixContracts/BankContracts/HodlBankContract";
import Footer from "./Footer";
import Hodlerg from "./Hodlerg";
import Refund from "./Refund";
import {WebsocketContext} from "./Contexts/WebsocketContext";
// import { WebsocketContext } from "../components/Contexts/WebsocketContext";

interface HodlERGInterfaceData {
    currentPrice: string;
    circulatingSupply: string;
    tvl: string;
}

const Main = () => {
    const [activeTab, setActiveTab] = useState("hodlerg");
    const [ergdata, setErgData] = useState<HodlERGInterfaceData | null>(null);
    const [lastBlock, setLastBlock] = useState(null);

    const socket = useContext(WebsocketContext);
    const sock = socket(isMainnet);
    const startSocket = async () => {
        sock.on("connect", () => {
            console.log("Connected!");
        });

        sock.on("new_block", (data: any) => {
            console.log("new block:", data);
            setLastBlock(data);
        });
    };

    useEffect(() => {
        startSocket();
    }, []);

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

                const circulatingSupplyUI =
                    Number(
                        (hodlBankContract.getHodlERG3EmissionAmount() * precisionBigInt) /
                        UIMultiplier
                    ) / precision;

                const tvlUI =
                    Number((tvl * precisionBigInt) / UIMultiplier) / precision;

                setErgData({
                    currentPrice: currentPriceUI.toString(),
                    circulatingSupply: circulatingSupplyUI.toString(),
                    tvl: tvlUI.toString(),
                });
            })
            .catch((err) => console.log(err));
    }, [lastBlock]);

    if (!ergdata) {
        return <Loader />;
    }

    return (
        <>
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === "hodlerg" && <Hodlerg ergdata={ergdata} />}
            {activeTab === "refund" && <Refund />}
            <Footer />
        </>
    );
};

export default Main;