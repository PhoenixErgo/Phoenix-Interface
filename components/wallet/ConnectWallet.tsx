import React, { useEffect, useState } from "react";
import { Button, Modal, Space, Tabs, TabsProps, Tooltip } from "antd";
import NautilusWalletButton from "./NautilusWalletButton";
import ErgoPayButton from "./ErgoPayButton";
import Image from "next/image";
import commonStyle from "../../styles/common.module.css";
import NautilusLogo from "../../public/NautilusLogo.png";
import ErgoLogoWhite from "../../public/symbol_bold__1080px__white.png";
import ErgoLogoDark from "../../public/ergo-icon.png";
import DisconnectNautilusWalletButton from "./DisconnectNautilusWalletButton";
import ErgoIcon from "../Common/ErgoIcon";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  Configuration,
  DefaultApiFactory,
} from "@/blockchain/ergo/explorerApi";
import {
  connectErgoPayWallet,
  connectNautilusWallet,
  disconnectWallet,
  WrongNetworkException,
} from "@/blockchain/ergo/wallet/connection";
import {
  handleCopyText,
  numberWithCommas,
  rateLimitedCoinGeckoERGUSD,
  reduceAddress,
} from "@/blockchain/ergo/wallet/utils";
import {
  syncAssetBalance,
  syncErgBalance,
} from "@/blockchain/ergo/wallet/sync";
import { noti_option_close } from "../Notifications/Toast";
import { fromEvent } from "rxjs";
import { io, Socket } from "socket.io-client";
import { EXPLORER_API_URL, EXPLORER_URL } from "@/blockchain/ergo/constants";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import ErgoIconModal from "@/components/Common/ErgoIconModal";

interface Token {
  tokenId: string;
  amount: number;
  decimals: number;
  name: string;
  tokenType: string;
  usdValue: number;
}
export interface walletLocalStorage {
  walletConnected: boolean;
  walletName: string;
  walletAddress: string[];
}

interface IProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const ConnectWallet: React.FC<IProps> = (props) => {
  const { socket } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNautilusOpen, setIsNautilusOpen] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [activeKey, setActiveKey] = useState("1");
  const [isLoading, setIsLoading] = useState(false);

  const [isMainnet, setIsMainnet] = useState<boolean | undefined>(undefined);
  const [walletConnected, setWalletConnected] = useState<boolean | undefined>(
    undefined
  );
  const [walletName, setWalletName] = useState<string | undefined>(undefined);
  const [walletAddress, setWalletAddress] = useState<string[] | undefined>(
    undefined
  );
  const [walletAssets, setWalletAssets] = useState<Token[]>([]);

  const [explorerApiClient, setExplorerApiClient] = useState<any>(null);
  const [usdOracle, setUsdOracle] = useState<number>(0);
  const [ergBalance, setErgBalance] = useState<string>("0");
  const [ergUSDValue, setErgUSDValue] = useState<any>("0");

  useEffect(() => {
    if (walletConnected && walletAddress) {
      syncWallet();
    }
  }, [walletAddress]);

  useEffect(() => {
    if (walletConnected && walletAddress) {
      const msgSubscription = fromEvent(socket!, "new_block").subscribe(
        (msg) => {
          syncWallet();
          console.log("syncing:", msg);
        }
      );

      return () => {
        msgSubscription.unsubscribe();
      };
    }
  }, [walletConnected]);

  useEffect(() => {
    const isMainnet = localStorage.getItem("IsMainnet")
      ? (JSON.parse(localStorage.getItem("IsMainnet")!) as boolean)
      : true;

    setIsMainnet(isMainnet);

    const walletConfig = localStorage.getItem("walletConfig")
      ? (JSON.parse(
          localStorage.getItem("walletConfig")!
        ) as walletLocalStorage)
      : undefined;

    if (walletConfig) {
      setWalletConnected(walletConfig.walletConnected);
      setWalletName(walletConfig.walletName);
      setWalletAddress(walletConfig.walletAddress);
    }

    rateLimitedCoinGeckoERGUSD().then((res: () => Promise<number>) => {
      res().then((value) => setUsdOracle(value));
    });

    const explorerConf = new Configuration({
      basePath: EXPLORER_API_URL(isMainnet),
    });
    const explorerClient = DefaultApiFactory(explorerConf);
    setExplorerApiClient(explorerClient);
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
    window.document.documentElement.classList.add("overflow-hidden");
    setActiveKey("1");
  };

  const handleOk = () => {
    setIsModalOpen(false);
    window.document.documentElement.classList.remove("overflow-hidden");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    window.document.documentElement.classList.remove("overflow-hidden");
  };

  const showNautilusModal = () => {
    setIsNautilusOpen(true);
    window.document.documentElement.classList.add("overflow-hidden");
  };
  const handleNautilusOk = () => {
    setIsNautilusOpen(false);
    window.document.documentElement.classList.remove("overflow-hidden");
  };

  const handleNautilusCancel = () => {
    setIsNautilusOpen(false);
    window.document.documentElement.classList.remove("overflow-hidden");
  };

  const onChange = (key: any) => {
    setActiveKey(key);
  };

  const toggleSelector = () => {
    if (!walletConnected) setShowSelector(!showSelector);
  };

  const syncWallet = async () => {
    syncErgBalance(
      walletAddress!,
      explorerApiClient,
      usdOracle,
      setErgBalance,
      setErgUSDValue
    );
    syncAssetBalance(
      walletAddress!,
      explorerApiClient,
      usdOracle,
      setWalletAssets
    );
  };

  const connectWallet = async (walletName: string, address?: string) => {
    if (walletName === "nautilus") {
      try {
        await connectNautilusWallet(
          setWalletConnected,
          walletName,
          setWalletName,
          setWalletAddress,
          setIsLoading,
          isMainnet!
        );
      } catch (error) {
        if (error instanceof WrongNetworkException) {
          toast.dismiss();
          toast.warn("wrong network", noti_option_close("try-again"));
        }
        console.log(error);
      }
      setIsModalOpen(false);
    } else if (walletName === "ergopay") {
      connectErgoPayWallet(
        address!,
        setWalletConnected,
        walletName,
        setWalletName,
        setWalletAddress,
        isMainnet!
      );
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Browser wallet`,
      children: (
        <NautilusWalletButton
          connectNautilus={() => connectWallet("nautilus")}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      ),
    },
    {
      key: "2",
      // disabled: true,
      label: `ErgoPay`,
      children: (
        <ErgoPayButton
          setIsModalOpen={setIsModalOpen}
          connectErgoPay={connectWallet}
          activeKey={activeKey}
          isMainnet={isMainnet!}
        />

        // <ErgoPayWalletModal
        //   setIsModalOpen={setIsModalOpen}
        //   connectErgoPay={connectWallet}
        //   activeKey={activeKey}
        //   isMainnet={isMainnet!}
        // />
      ),
    },
  ];

  return (
    <>
      <Space
        className="site-button-ghost-wrapper px-3 sm:ml-6 mb-4 sm:mb-0   connectWalletBtn w-full"
        wrap
        onClick={walletConnected ? showNautilusModal : showModal}
        style={{ fontFamily: `'Space Grotesk', sans-serif` }}
      >
        {walletConnected ? (
          walletName && walletName === "ergopay" ? (
            <Button
              type="primary"
              size="large"
              ghost
              style={{
                color: "black",
                border: "1px solid #D9D9D9",
                fontFamily: `'Vela Sans', sans-serif`,
                background: "#1D1D1D !important",
              }}
              className="flex items-center w-full"
            >
              <div className="flex w-full">
                <button
                  className="w-full"
                  style={{
                    color: "black",
                    borderRadius: 5,
                    background: "#1D1D1D !important",
                    padding: "3px 10px",
                    fontFamily: `'Vela Sans', sans-serif`,
                  }}
                >
                  <div className="flex w-full">
                    <Image
                      style={{ marginRight: 10 }}
                      alt="img"
                      width="25"
                      src={ErgoLogoDark}
                    />
                    <div style={{ fontFamily: `'Vela Sans', sans-serif` }}>
                      {reduceAddress(walletAddress![0])}
                    </div>
                  </div>
                </button>
              </div>
            </Button>
          ) : (
            <Button
              type="primary"
              size="large"
              ghost
              style={{
                color: "black",
                border: "1px solid #D9D9D9",
                fontFamily: `'Vela Sans', sans-serif`,
              }}
              className="flex items-center w-full"
            >
              <div className="flex w-full">
                <span
                  style={{
                    padding: "3px 0px",
                    fontFamily: `'Vela Sans', sans-serif`,
                  }}
                >
                  {numberWithCommas(parseInt(ergBalance), 9)} ERG
                </span>
                <button
                  className="w-full"
                  style={{
                    borderRadius: 5,
                    background: "#FAFAFA",
                    color: "black",
                    marginLeft: 10,
                    padding: "3px 10px",
                    fontFamily: `'Vela Sans', sans-serif !important`,
                  }}
                >
                  <div
                    className="flex w-full"
                    style={{ fontFamily: `'Vela Sans', sans-serif !important` }}
                  >
                    <Image
                      style={{
                        fontFamily: `'Vela Sans', sans-serif !important`,
                      }}
                      alt="img"
                      width="25"
                      src={NautilusLogo}
                    />
                    <div style={{ fontFamily: `'Vela Sans', sans-serif` }}>
                      {reduceAddress(walletAddress![0])}
                    </div>
                  </div>
                </button>
              </div>
            </Button>
          )
        ) : (
          <button
            type="button"
            className="focus:outline-none text-white w-full sm:w-fit primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300 font-medium rounded text-md px-3 sm:px-5 py-2 sm:py-2.5"
          >
            CONNECT WALLET
          </button>
        )}
      </Space>

      {/*main modal*/}
      <Modal
        className="browser-wallet-modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        style={{ fontFamily: `'Space Grotesk', sans-serif`, maxWidth: 464 }}
      >
        <h5 style={{ fontFamily: `'Vela Sans', sans-serif` }}>
          Select a wallet
        </h5>
        <Tabs
          defaultActiveKey="1"
          centered
          items={items}
          onChange={onChange}
          animated
          activeKey={activeKey}
          style={{ fontFamily: `'Vela Sans', sans-serif` }}
        />
      </Modal>

      {/*nautilus wallet button*/}
      <Modal
        className="ergo-pay-wallet-modal"
        open={isNautilusOpen}
        onOk={handleNautilusOk}
        onCancel={handleNautilusCancel}
        footer={null}
        style={{ fontFamily: `'Space Grotesk', sans-serif`, maxWidth: 464 }}
      >
        {walletName && walletName === "ergopay" ? (
          <div
            style={{
              fontFamily: `'Space Grotesk', sans-serif`,
            }}
          >
            <div className="flex items-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="12" fill="black"></circle>
                <path
                  d="M20.6979 11.7378L18.3358 6.03509C18.2663 5.86717 18.1328 5.73375 17.9649 5.66419L12.2622 3.30213C12.0943 3.23262 11.9057 3.23262 11.7377 3.30213L6.03522 5.66419C5.86729 5.73375 5.73387 5.86717 5.6643 6.03509L3.30225 11.7378C3.26776 11.8209 3.25 11.91 3.25 12C3.25 12.09 3.26776 12.1792 3.30225 12.2623L5.6643 17.9648C5.73387 18.1327 5.86729 18.2661 6.03522 18.3357L11.7377 20.6978C11.8209 20.7322 11.91 20.75 12 20.75C12.09 20.75 12.1791 20.7322 12.2622 20.6978L17.9649 18.3357C18.1328 18.2661 18.2663 18.1327 18.3358 17.9648L20.6979 12.2623C20.7674 12.0944 20.7674 11.9057 20.6979 11.7378ZM14.832 9.75245H11.5165L13.5717 11.9047L11.4444 14.2474H14.8311V15.8212H9.16874V14.3907L11.3969 11.9241L9.17944 9.61326V8.17888H14.8312L14.832 9.75245Z"
                  fill="white"
                ></path>
              </svg>
              <h3 className="ms-3 m-0 font-bold text-darkblack text-[18px] xl:text-[20px]">
                ErgoPay
              </h3>
            </div>
            <div>
              <p
                className="mb-2 mt-4 text-[14px] font-semibold text-darkblack"
                style={{
                  fontFamily: `'Vela Sans', sans-serif`,
                }}
              >
                Total balance
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              className={`${commonStyle.ergoBalanceDiv}`}
            >
              <div className="flex items-center">
                <ErgoIconModal />
                <p className={commonStyle.ergoBalanceText}>
                  {numberWithCommas(parseInt(ergBalance), 9)} ERG
                </p>
              </div>
              <div>
                <p className="m-0 text-[14px] sm:text-[16px] font-medium text-black">
                  ${numberWithCommas(parseInt(ergBalance), 9)}
                </p>
              </div>
            </div>
            <div>
              <p
                className="mb-2 mt-4 text-[14px] sm:text-[16px] font-semibold text-black"
                style={{
                  fontFamily: `'Vela Sans', sans-serif`,
                }}
              >
                Active address
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              className={`${commonStyle.ergoBalanceDiv}`}
            >
              <p className={commonStyle.ergoBalanceAdd}>
                {walletAddress
                  ? walletAddress[0].slice(0, 18) +
                    "..." +
                    walletAddress[0].slice(-8)
                  : ""}
              </p>
              <div className="flex">
                <div className="mr-3 cursor-pointer">
                  <CopyToClipboard
                    text={walletAddress![0]}
                    onCopy={(e) =>
                      handleCopyText("Address successfully copied!")
                    }
                  >
                    <Tooltip
                      placement="top"
                      title="Copy Address to clipboard."
                      className={commonStyle.addressIcons}
                    >
                      <FontAwesomeIcon color="black" icon={faCopy} />
                    </Tooltip>
                  </CopyToClipboard>
                </div>

                <div className="cursor-pointer">
                  <a
                    href={`${EXPLORER_URL(isMainnet!)}/addresses/${
                      walletAddress![0]
                    }`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Tooltip
                      placement="top"
                      title="View on explorer."
                      className={commonStyle.addressIcons}
                    >
                      <FontAwesomeIcon
                        color="black"
                        icon={faArrowUpRightFromSquare}
                      />
                    </Tooltip>
                  </a>
                </div>
              </div>
            </div>
            {walletAssets.length > 0 && (
              <div>
                <p
                  className="mb-2 mt-4 text-[14px] sm:text-[16px] font-semibold text-black"
                  style={{ fontFamily: `'Vela Sans', sans-serif` }}
                >
                  Tokens
                </p>
              </div>
            )}

            <div
              style={
                walletAssets.length > 4
                  ? { maxHeight: 275, overflowY: "scroll" }
                  : undefined
              }
            >
              {walletAssets.map((item: Token) => (
                <div
                  key={item.tokenId}
                  className={`flex items-center justify-between ${commonStyle.ergoTokenBalanceDiv}`}
                >
                  <div className="flex items-center">
                    <Image
                      src={`https://raw.githubusercontent.com/spectrum-finance/token-logos/master/light/${item.tokenId}.svg`}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = `https://raw.githubusercontent.com/spectrum-finance/token-logos/master/empty.svg`;
                      }}
                      alt="logo"
                      width={25}
                      height={25}
                    />
                    <div>
                      <p className={commonStyle.ergoBalanceTokenP}>
                        {item.name}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="m-0">
                      {numberWithCommas(item.amount, item.decimals)}
                    </p>
                    <small
                      className="m-0 flex justify-end"
                      style={{
                        color: "#A6A6A6",
                      }}
                    >
                      ${item.usdValue === 0 ? "0.00" : item.usdValue}
                    </small>
                  </div>
                </div>
              ))}
            </div>
            <DisconnectNautilusWalletButton
              disconnectWallet={() =>
                disconnectWallet(
                  setWalletConnected,
                  walletName,
                  setWalletName,
                  setWalletAddress
                )
              }
              setIsNautilusOpen={setIsNautilusOpen}
            />
          </div>
        ) : (
          <div style={{ fontFamily: `'Space Grotesk', sans-serif` }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Image alt="img" height="32" width="32" src={NautilusLogo} />
              <h5 className="ms-3 m-0 text-[18px] font-bold text-black">
                Nautilus Wallet
              </h5>
            </div>

            <div>
              <p
                className="mb-2 mt-4 text-[18px] font-bold text-black"
                style={{
                  fontFamily: `'Vela Sans', sans-serif`,
                }}
              >
                Total balance
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              className={`${commonStyle.ergoBalanceDiv}`}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <ErgoIconModal />
                <p className={commonStyle.ergoBalanceText}>
                  {numberWithCommas(parseInt(ergBalance), 9)} ERG
                </p>
              </div>
              <div>
                <p className="m-0" style={{ color: "#949494" }}>
                  ${ergUSDValue}
                </p>
              </div>
            </div>

            <div>
              <p
                className="mb-2 mt-4"
                style={{
                  fontFamily: `'Vela Sans', sans-serif`,
                  fontWeight: "bold",
                }}
              >
                Active address
              </p>
            </div>
            <div
              className={`flex align-items-center justify-between ${commonStyle.ergoBalanceDiv}`}
            >
              <div>
                <p className={commonStyle.ergoBalanceAdd}>
                  {walletAddress
                    ? walletAddress[0].slice(0, 18) +
                      "..." +
                      walletAddress[0].slice(-8)
                    : ""}
                </p>
              </div>

              <div className="flex">
                <div className="mr-3 cursor-pointer">
                  <CopyToClipboard
                    text={walletAddress ? walletAddress[0] : ""}
                    onCopy={(e) =>
                      handleCopyText("Address successfully copied!")
                    }
                  >
                    <Tooltip
                      placement="top"
                      title="Copy Address to clipboard."
                      className={commonStyle.addressIcons}
                    >
                      <FontAwesomeIcon icon={faCopy} />
                    </Tooltip>
                  </CopyToClipboard>
                </div>

                <div className="cursor-pointer">
                  <a
                    href={`${EXPLORER_URL(isMainnet!)}/addresses/${
                      walletAddress ? walletAddress[0] : ""
                    }`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Tooltip
                      placement="top"
                      title="View on explorer."
                      className={commonStyle.addressIcons}
                    >
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    </Tooltip>
                  </a>
                </div>
              </div>
            </div>
            {walletAssets.length > 0 && (
              <div>
                <p
                  className="mb-2 mt-4 font-bold"
                  style={{ fontFamily: `'Vela Sans', sans-serif` }}
                >
                  Tokens
                </p>
              </div>
            )}

            <div
              style={
                walletAssets.length > 4
                  ? { maxHeight: 275, overflowY: "scroll" }
                  : undefined
              }
            >
              {walletAssets.map((item: Token) => (
                <div
                  key={item.tokenId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  className={`${commonStyle.ergoTokenBalanceDiv}`}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Image
                      src={`https://raw.githubusercontent.com/spectrum-finance/token-logos/master/light/${item.tokenId}.svg`}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = `https://raw.githubusercontent.com/spectrum-finance/token-logos/master/empty.svg`;
                      }}
                      alt="logo"
                      width={25}
                      height={25}
                    />
                    <div>
                      <p className={commonStyle.ergoBalanceTokenP}>
                        {item.name}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="m-0 font-bold">
                      {numberWithCommas(item.amount, item.decimals)}
                    </p>
                    <small
                      className="m-0 flex justify-end"
                      style={{
                        color: "#949494",
                      }}
                    >
                      ${item.usdValue === 0 ? "0.00" : item.usdValue}
                    </small>
                  </div>
                </div>
              ))}
            </div>

            <DisconnectNautilusWalletButton
              disconnectWallet={() =>
                disconnectWallet(
                  setWalletConnected,
                  walletName,
                  setWalletName,
                  setWalletAddress
                )
              }
              setIsNautilusOpen={setIsNautilusOpen}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default ConnectWallet;
