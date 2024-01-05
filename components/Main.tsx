import React, { useContext, useEffect, useState } from "react";
import Loader from "./Loader";
import Navbar from "./Navbar";
import {
  BANK_SINGLETON_TOKEN_ID, BASE_TOKEN_ID,
  explorerClient,
  NEXT_PUBLIC_NEST_API_URL,
  precision,
  precisionBigInt,
  UIMultiplier,
} from "@/blockchain/ergo/constants";
import { HodlBankContract } from "@/blockchain/ergo/phoenixContracts/BankContracts/HodlBankContract";
import Footer from "./Footer";
import Hodlerg from "./Hodlerg";
import Refund from "./Refund";
import { fromEvent } from "rxjs";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { getWalletConfig } from "@/blockchain/ergo/wallet/utils";
import { getWalletConnection } from "@/blockchain/ergo/walletUtils/utils";
import {HodlTokenContract} from "@/blockchain/ergo/phoenixContracts/BankContracts/HodlTokenContract";
import {toast} from "react-toastify";
import {noti_option_close} from "@/components/Notifications/Toast";

interface HodlERGInterfaceData {
  currentPrice: string;
  circulatingSupply: string;
  tvl: string;
}

const Main = () => {
  const [isMainnet, setIsMainnet] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState("hodlerg");
  const [ergdata, setErgData] = useState<HodlERGInterfaceData | null>(null);
  const [lastBlock, setLastBlock] = useState(null);

  const [socket, setSocket] = useState<
    Socket<DefaultEventsMap, DefaultEventsMap> | undefined
  >(undefined);

  useEffect(() => {
    const socket = io(NEXT_PUBLIC_NEST_API_URL(isMainnet!));
    setSocket(socket);

    const msgSubscription = fromEvent(socket, "new_block").subscribe((msg) => {
      setLastBlock(msg);
      console.log("Received message: ", msg);
    });

    return () => {
      msgSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const isMainnet = localStorage.getItem("IsMainnet")
      ? (JSON.parse(localStorage.getItem("IsMainnet")!) as boolean)
      : true;

    setIsMainnet(isMainnet);

    const walletConfig = getWalletConfig();

    if (walletConfig && walletConfig.walletName === "nautilus") {
      getWalletConnection();
    }
  }, []);

  useEffect(() => {
    const isMainnet = localStorage.getItem("IsMainnet")
      ? (JSON.parse(localStorage.getItem("IsMainnet")!) as boolean)
      : true;

    // console.log(BANK_SINGLETON_TOKEN_ID(isMainnet));
    explorerClient(isMainnet)
      .getApiV1BoxesUnspentBytokenidP1(BANK_SINGLETON_TOKEN_ID(isMainnet))
      .then((res) => {

        explorerClient(isMainnet)
            .getApiV1TokensP1(BASE_TOKEN_ID(isMainnet))
            .then((tokenInfo) => {

              if(tokenInfo.data.decimals === undefined){
                throw new Error('cannot get decimals');
              }

              const baseTokenSingleUnit =  Math.pow(10, tokenInfo.data.decimals);

              const precisionBigInt = BigInt(baseTokenSingleUnit);
              const UIMultiplier = BigInt(baseTokenSingleUnit);
              const precision = baseTokenSingleUnit;

              const bankBox = res.data.items![0];
              const hodlBankContract = new HodlTokenContract(bankBox);

              const currentPrice = hodlBankContract.mintAmount(BigInt(baseTokenSingleUnit));
              const tvl = hodlBankContract.getTVL();

              const currentPriceUI =
                  Number((currentPrice * precisionBigInt) / UIMultiplier) / precision;

              const circulatingSupplyUI =
                  Number(
                      (hodlBankContract.getHodlEmissionAmount() * precisionBigInt) /
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
            .catch((err) => {
              console.log(err);
              toast.dismiss();
              toast.warn("error getting base token decimals", noti_option_close("try-again"));
            });

      })
      .catch((err) => console.log(err));
  }, [lastBlock]);

  if (!ergdata) {
    return <Loader />;
  }

  return (
    <>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        socket={socket}
      />
      {activeTab === "hodlerg" && <Hodlerg ergdata={ergdata} />}
      {activeTab === "refund" && <Refund />}
      <Footer />
    </>
  );
};

export default Main;
