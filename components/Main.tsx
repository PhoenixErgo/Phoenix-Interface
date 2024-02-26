import React, { useContext, useEffect, useState } from "react";
import Loader from "./Loader";
import Navbar from "./Navbar";
import {
  BANK_SINGLETON_TOKEN_ID,
  explorerClient,
  NEXT_PUBLIC_NEST_API_URL,
} from "@/blockchain/ergo/constants";
import { HodlBankContract as ErgoHodlBankContract } from "@/blockchain/ergo/phoenixContracts/BankContracts/HodlBankContract";
import { HodlBankContract as AlephiumHodlBankContract } from "@/blockchain/alephium/phoenixContracts/BankContracts/HodlBankContract";
import Footer from "./Footer";
import HodlPage from "./Hodlerg/HodlPage";
import Hodltoken from "./Hodltoken/Hodltoken";
import Create from "./Create/Create";
import Refund from "./Refund";
import { fromEvent } from "rxjs";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { getWalletConfig } from "@/blockchain/ergo/wallet/utils";
import { getWalletConnection } from "@/blockchain/ergo/walletUtils/utils";
import {formatBigIntWithDecimalsRounded} from "@/common/utils";
import {getPhoenixConfig} from "@/blockchain/alephium/services/utils";
import {AlephiumWalletProvider} from "@alephium/web3-react";

interface HodlERGInterfaceData {
  currentPrice: string;
  circulatingSupply: string;
  tvl: string;
}

const Main = () => {
  const [network, setNetwork] = useState<string | null>(null);
  const [ALPHNetwork, setALPHNetwork] = useState<string>('');
  const [activeTab, setActiveTab] = useState("hodl");
  const [gameData, setGameData] = useState<HodlERGInterfaceData | null>(null);
  const [lastBlock, setLastBlock] = useState(null);

  const [socket, setSocket] = useState<
    Socket<DefaultEventsMap, DefaultEventsMap> | undefined
  >(undefined);

  useEffect(() => {
    const socket = io(NEXT_PUBLIC_NEST_API_URL(!network || network === '1'));
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
    const storedNetwork = localStorage.getItem("network");
    setNetwork(storedNetwork);

    switch (storedNetwork) {
      case '1':
      case '3':
      default:
        const walletConfig = getWalletConfig();
        if (walletConfig && walletConfig.walletName === "nautilus") {
          getWalletConnection();
        }
        break;
      case '4':
        setALPHNetwork('mainnet');
        break;
      case '5':
        setALPHNetwork('testnet');
        break;
      case '6':
        setALPHNetwork('devnet');
        break;
    }
  }, []);

  useEffect(() => {

    const storedNetwork = localStorage.getItem("network");

    switch (storedNetwork) {
      case '1':
      case '3':
      default:{
        const isMainnet = !storedNetwork || storedNetwork === '1';

        explorerClient(isMainnet)
            .getApiV1BoxesUnspentBytokenidP1(BANK_SINGLETON_TOKEN_ID(isMainnet))
            .then((res) => {
              const bankBox = res.data.items![0];
              const hodlBankContract = new ErgoHodlBankContract(bankBox);

              const currentPrice = hodlBankContract.mintAmount(BigInt(1e9));
              const tvl = hodlBankContract.getTVL();
              const circulatingSupply = hodlBankContract.getHodlERG3EmissionAmount();

              setGameData({
                currentPrice: formatBigIntWithDecimalsRounded(currentPrice, 9, 4),
                circulatingSupply: formatBigIntWithDecimalsRounded(circulatingSupply, 9, 4),
                tvl: formatBigIntWithDecimalsRounded(tvl, 9, 4),
              });
            })
            .catch((error) => console.error('Failed to fetch data from hodlBankContract:', error));
        break;
      }
      case '4':
      case '5':
      case '6': {
        const hodlBankContract = new AlephiumHodlBankContract(getPhoenixConfig(network).bankAddress, network);

        Promise.all([
          hodlBankContract.mintAmount(BigInt(1e18)),
          hodlBankContract.getHodlALPHEmissionAmount(),
          hodlBankContract.getTVL()
        ]).then(([currentPrice, circulatingSupply, tvl]) => {
          console.log('tvl', tvl)
          setGameData({
            currentPrice: formatBigIntWithDecimalsRounded(currentPrice, 18, 4),
            circulatingSupply: formatBigIntWithDecimalsRounded(circulatingSupply, 18, 4),
            tvl: formatBigIntWithDecimalsRounded(tvl, 18, 4),
          });
        }).catch(error => {
          console.error('Failed to fetch data from hodlBankContract:', error);
        });
        // setGameData({
        //   currentPrice: '1.0150',
        //   circulatingSupply: '1667.8583',
        //   tvl: '1692.9020',
        // });
        break;
      }
    }
  }, [lastBlock]);

  if (!gameData) {
    return <Loader />;
  }


  return (
      // @ts-ignore
      <AlephiumWalletProvider theme="rounded" network={ALPHNetwork} addressGroup={0}>
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        socket={socket}
        network={network}
      />
      {activeTab === "hodltoken" && <Hodltoken network={network} />}
      {activeTab === "hodl" && <HodlPage gameData={gameData} network={network} />}
      {!network || network === '1' ? activeTab === "refund" && <Refund network={network} /> : null}
      {activeTab === "create" && <Create network={network} />}
      <Footer />
    </div>
      </AlephiumWalletProvider>
  );
};

export default Main;
