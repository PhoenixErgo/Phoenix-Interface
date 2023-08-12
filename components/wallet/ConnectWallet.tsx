import React, {MouseEventHandler, useContext, useEffect, useRef, useState} from 'react';
import {Button, Modal, Space, Tabs, TabsProps, Tooltip} from 'antd';
import NautilusWalletButton from './NautilusWalletButton';
import Image from 'next/image';
import commonStyle from '../../styles/common.module.css';
import NautilusLogo from '../../public/NautilusLogo.png';
import ErgoLogoWhite from '../../public/symbol_bold__1080px__white.png';
import DisconnectNautilusWalletButton from './DisconnectNautilusWalletButton';
import ErgoIcon from '../Common/ErgoIcon';
import {toast} from 'react-toastify';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowUpRightFromSquare, faCopy,} from '@fortawesome/free-solid-svg-icons';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {ErgoDexService} from './ergoDexService';
import {EXPLORER_API_URL, EXPLORER_URL, rateLimitedCoinGeckoERGUSD} from '../../blockchain/ergo/api';
import {WebsocketContext} from '../Contexts/WebsocketContext';
import {ErgoAddress, Network} from '@fleet-sdk/core';
import ErgoPayWalletModal from "./ErgoPayWalletModal";
import ErgoIconModal from "../Common/ErgoIconModal";

interface TokenBalance {
  tokenId: string;
  balance: string;
}
interface Token {
  tokenId: string;
  amount: number;
  decimals: number;
  name: string;
  tokenType: string;
  usdValue: number;
}

interface TokenMetadata {
  id: string;
  boxId: string;
  emissionAmount: number;
  name: string;
  description: string;
  type: string;
  decimals: number;
}

interface Ticker {
  ticker_id: string;
  base_currency: string;
  target_currency: string;
  last_price: number;
  liquidity_in_usd: number;
  base_volume: number;
  target_volume: number;
  pool_id: string;
}

const axios = require('axios');

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

const ConnectWallet: React.FC = ({ props }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNautilusOpen, setIsNautilusOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState<any>('');
  const [walletBtnAddress, setWalletBtnAddress] = useState<any>('');
  const [ergUSDValue, setErgUSDValue] = useState<any>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [ergoWallet, setErgoWallet] = useState<any>();
  const [ergoPay, setErgoPay] = useState(false);
  const [ergBalance, setErgBalance] = useState<string>('0');
  const [textToCopy, setTextToCopy] = useState<string>('');
  const [walletData, setWalletData] = useState<any>([]);
  const [externalLink, setExternalLink] = useState<any>('');
  const [activeKey, setActiveKey] = useState('1');
  const [usdOracle, setUsdOracle] = useState<number>(0);
  const socket = useContext(WebsocketContext);


  async function startWallet(): Promise<string | undefined> {
    const isMainnet = localStorage.getItem('IsMainnet') ? JSON.parse(localStorage.getItem('IsMainnet')!) as boolean : true;
    console.log("loading wallet!")
    const checkWallet = localStorage.getItem('walletConnected');
    if (checkWallet === 'true') {
      const whichWallet = localStorage.getItem('walletUsed');
      console.log(whichWallet);
      if (whichWallet === 'nautilus') {
        const access_granted = await (window as any).ergoConnector.nautilus.connect();
        if(access_granted){
          localStorage.setItem('walletConnected', 'true');
          setWalletConnected(true);
          const changeAddress = await ergo!.get_change_address();
          localStorage.setItem('walletAddress', changeAddress);
          setDefaultAddress(changeAddress);
          setWalletBtnAddress(
            changeAddress.slice(0, 5) + '...' + changeAddress.slice(-4),
          );
          setTextToCopy(changeAddress);
          setExternalLink(
            `${EXPLORER_URL(isMainnet)}/addresses/${changeAddress}`,
          );
          const balance = await ergo!.get_balance();
          setErgBalance(balance)
          const ctx = await (window as any).ergoConnector.nautilus.getContext();
          setErgoWallet(ctx);
          await walletMetadata();
          return changeAddress;
        } else {
          setWalletConnected(false);
          return undefined;
        }
      } else {
        setErgoPay(true);
        setWalletConnected(true);
        localStorage.setItem('walletUsed', 'ergopay');
        console.log('ergoPay!!');
        localStorage.setItem('walletAddress', 'ErgoPay');
        setDefaultAddress('ErgoPay');
        localStorage.setItem('walletConnected', 'true');
        return undefined;
      }
    }
    return undefined;
  }

  async function walletMetadata(){

    const tokenArr = (await fetchTokenMetadata()).filter(t => Object.keys(t).length > 0)

    if (JSON.stringify(walletDataRef.current) !== JSON.stringify(tokenArr)) {
      setWalletData(tokenArr);
    }

    const ergBal = await ergo!.get_balance();
    if(ergBal !== ergBalanceRef.current){
      setErgBalance(ergBal);
    }

    const erg = parseInt(ergBal) * 10 ** -9;
    const ergUSD = getERGUSD(erg, usdOracleRef.current).toFixed(3);
    if(ergUSD !== ergUSDValueRef.current){
      setErgUSDValue(ergUSD);
    }
  }


  function disconnectWallet() {
    if (localStorage.getItem('walletUsed') == 'ergopay') {
      setErgoPay(false);
      setWalletData([]);
      localStorage.removeItem('walletConnected');
      localStorage.removeItem('walletUsed');
      localStorage.removeItem('walletAddress');
      setWalletConnected(false);
      setErgoWallet(null);
      setDefaultAddress('');
    }
    if (typeof (window as any).ergo_request_read_access === 'undefined') {
    } else {
      if (walletConnected) {
        setWalletData([]);
        setWalletConnected(false);
        setErgoWallet(null);
        setDefaultAddress('');
        localStorage.removeItem('walletAddress');
        localStorage.removeItem('walletConnected');
        localStorage.removeItem('walletUsed');
        (window as any).ergoConnector.nautilus.disconnect();
      }
    }
  }

  const noti_option_close: any = {
    position: 'top-right',
    toastId: 'wallet -not-found',
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    theme: 'dark',

    onClick: (props: any) =>
      window.open(
        `https://chrome.google.com/webstore/detail/nautilus-wallet/gjlmehlldlphhljhpnlddaodbjjcchai/`,
        '_blank',
      ),
  };

  const toaster_copy_text: any = {
    position: 'bottom-right',
    toastId: 'Address copy',
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    theme: 'dark',
  };

  const defaultAddressRef = useRef<string>(defaultAddress);
  const usdOracleRef = useRef<number>(usdOracle);
  const ergBalanceRef = useRef<string>(ergBalance);
  const walletDataRef = useRef<any>(walletData);
  const ergUSDValueRef = useRef<any>(ergUSDValue);

  useEffect(() => {
    defaultAddressRef.current = defaultAddress;
    usdOracleRef.current = usdOracle;
    ergBalanceRef.current = ergBalance;
    ergUSDValueRef.current = ergUSDValue;
  }, [defaultAddress, usdOracle, ergBalance, walletData, ergUSDValue]);

  useEffect(() => {

    rateLimitedCoinGeckoERGUSD().then((res: () => Promise<number>) => {
      res().then(value => setUsdOracle(value));
    })
    const isMainnet = localStorage.getItem('IsMainnet') ? JSON.parse(localStorage.getItem('IsMainnet')!) as boolean : true;
    const sock = socket(isMainnet)

    const startWalletAndSetupSocket = async () => {
      let address = await startWallet();
      console.log("wallet started:", address);


      sock.on('connect', () => {
        console.log('Connected!');
      });

      sock.on('new_block', (data: any) => {
        console.log(data);
        console.log(address);
        if (address) {
          walletMetadata();
        }
        address = defaultAddressRef.current;
      });
    };

    // Call the function
    startWalletAndSetupSocket();

    return () => {
      console.log("Disconnecting socket");
      sock.off('connect').off();
      sock.off('new_block').off();
      console.log("Disconnected socket");
    }
  }, []);

  useEffect(() => {
    window.addEventListener('ergo_wallet_disconnected', () => {
      disconnectWallet();
    });
  }, [disconnectWallet]);

  const showModal = () => {
    setIsModalOpen(true);
    window.document.documentElement.classList.add('overflow-hidden');
    setActiveKey('1');
  };

  const handleOk = () => {
    setIsModalOpen(false);
    window.document.documentElement.classList.remove('overflow-hidden');
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    window.document.documentElement.classList.remove('overflow-hidden');
  };

  const showNautilusModal = () => {
    setIsNautilusOpen(true);
    window.document.documentElement.classList.add('overflow-hidden');
  };
  const handleNautilusOk = () => {
    setIsNautilusOpen(false);
    window.document.documentElement.classList.remove('overflow-hidden');
  };

  const handleNautilusCancel = () => {
    setIsNautilusOpen(false);
    window.document.documentElement.classList.remove('overflow-hidden');
  };

  const onChange = (key: any) => {
    setActiveKey(key);
  };

  const toggleSelector = () => {
    if (!walletConnected) setShowSelector(!showSelector);
  };

  const handleCopyText = (e: any) => {
    toast.success('Address successfully copied!', toaster_copy_text);
  };

  const connectErgoPay: MouseEventHandler<HTMLButtonElement> = () => {
    disconnectWallet();
    setErgoPay(true);
    setWalletConnected(true);
    localStorage.setItem('walletUsed', 'ergopay');
    console.log('ergoPay!! ');
    localStorage.setItem('walletAddress', 'ErgoPay');
    setDefaultAddress('ErgoPay');
    localStorage.setItem('walletConnected', 'true');
    toggleSelector();
  };
  class WrongNetworkException extends Error {}

  const connectNautilus = () => {
    const isMainnet = localStorage.getItem('IsMainnet') ? JSON.parse(localStorage.getItem('IsMainnet')!) as boolean : true;
    disconnectWallet();
    setIsLoading(true);
    if (!(window as any).ergoConnector) {
      toast.warn('Click me to get nautilus!', noti_option_close);
      return;
    }
    // @ts-ignore
    (window as any).ergoConnector.nautilus
      .isConnected()
      .then((connected: any) => {
        if (!walletConnected) {
          return (window as any).ergoConnector.nautilus
            .connect()
            .then((access_granted: any) => {
              if (access_granted) {
                return ergo!.get_change_address().then((address: any) => {
                  if(ErgoAddress.getNetworkType(address) !== (isMainnet ? Network.Mainnet : Network.Testnet)){
                    throw new WrongNetworkException();
                  }
                });
              } else {
                setWalletConnected(false);
                setIsLoading(false);
                throw new WrongNetworkException();
              }
            })
            .then(() => {
              localStorage.setItem('walletConnected', 'true');
              localStorage.setItem('walletUsed', 'nautilus');
              startWallet()
              setWalletConnected(true);

              return (window as any).ergoConnector.nautilus
                .getContext()
                .then((context: any) => {
                  setErgoWallet(context);
                  setIsModalOpen(false);
                  setIsLoading(false);
                  window.document.documentElement.classList.remove('overflow-hidden');
                });
            });
        } else {
          // Already connected
          toggleSelector();
          return Promise.resolve();
        }
      })
      //@ts-ignore
      .catch((error) => {
        if (error instanceof WrongNetworkException) {
          console.log("wrong network!");
          disconnectWallet();
          setIsLoading(false);
        } else {
          // Handle other errors
        }
      });
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Browser wallet`,
      children: (
        <NautilusWalletButton
          connectNautilus={connectNautilus}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      ),
    },
    {
      key: '2',
      // disabled: true,
      label: `ErgoPay`,
      children: (
        // <ErgoPayButton
        //   setIsModalOpen={setIsModalOpen}
        //   connectErgoPay={connectErgoPay}
        //   ergoPay={ergoPay}
        //   setErgoPay={setErgoPay}
        //   activeKey={activeKey}
        // />
          <ErgoPayWalletModal
              setIsModalOpen={setIsModalOpen}
              connectErgoPay={connectErgoPay}
              ergoPay={ergoPay}
              setErgoPay={setErgoPay}
              activeKey={activeKey}/>
      ),
    },
  ];
  const getAddress = async () => {
    try {
      // @ts-ignore
      if (typeof ergo !== 'undefined') {
        // @ts-ignore
        return await ergo?.get_change_address();
      }
    } catch (e) {
      throw e;
    }
  };

  const getWalletBalance = async (): Promise<TokenBalance[]> => {
    try {
      //@ts-ignore
      if (typeof ergo !== 'undefined') {
        //@ts-ignore
        const balance = await ergo?.get_balance('all');
        return balance as TokenBalance[]; // Type assertion
      } else {
        return [];
      }
    } catch (e) {
      throw e;
    }
  };

  const getTokenInfo = async (tokenID: string, isMainnet: boolean): Promise<TokenMetadata> => {
    try {
      const response = await axios.get(
        `${EXPLORER_API_URL(isMainnet)}/api/v1/tokens/${tokenID}`,
      );
      return response.data as TokenMetadata;
    } catch (error) {
      console.error('Error fetching token info', error);
      return {} as TokenMetadata;
    }
  };

  const getTokenERGValue = async (
    ergoDexService: ErgoDexService,
    tokenID: string,
  ): Promise<number> => {
    try {
      const targetTicker: number | undefined = (
        await ergoDexService.getTokenRates()
      )[tokenID].erg;

      return targetTicker ? targetTicker : 0;
    } catch (error) {
      console.error('Error fetching token erg price');
      return 0;
    }
  };

  const fetchTokenMetadata = async (): Promise<Token[]> => {
    const isMainnet = localStorage.getItem('IsMainnet') ? JSON.parse(localStorage.getItem('IsMainnet')!) as boolean : true;
    const walletTokenBalance = (await getWalletBalance()).filter(
      (asset) => asset.tokenId !== 'ERG',
    );
    const ergoDexService = new ErgoDexService();
    const tokenErgPrice = await ergoDexService.getTokenRates();

    return await Promise.all(
      walletTokenBalance.map(async (asset) => {
        const tokenInfo = await getTokenInfo(asset.tokenId, isMainnet);
        if(Object.keys(tokenInfo).length === 0){
          return {} as Token;
        }
        const potentialTokenERGValue = tokenErgPrice[asset.tokenId];
        const tokenERGValue = potentialTokenERGValue ? potentialTokenERGValue.erg : 0;
        const totalTokenERGValue =
          parseFloat(asset.balance) * 10 ** -tokenInfo.decimals * tokenERGValue;
        const tokenUSDValue = getERGUSD(totalTokenERGValue, usdOracleRef.current);

        return {
          tokenId: asset.tokenId,
          amount: parseFloat(asset.balance),
          decimals: tokenInfo.decimals,
          name: tokenInfo.name,
          tokenType: tokenInfo.type,
          usdValue: tokenUSDValue,
        } as Token;
      }),
    );
  };

  const numberWithCommas = (number: number, decimal: number): string => {
    const amountWithDecimals = number * 10 ** -decimal;
    return amountWithDecimals.toLocaleString('en');
  };

  const getERGUSD = (erg: number, usdValue: number): number => {
    try {
      return parseFloat((erg * usdValue).toFixed(2));
    } catch (error) {
      // Handle error appropriately
      console.error('Error fetching ERG to USD conversion:', error);
      return 0.0;
    }
  };

  return (
    <>
      <Space
        className="site-button-ghost-wrapper ml-6 velaSans  connectWalletBtn"
        wrap
        onClick={walletConnected ? showNautilusModal : showModal}
        style={{ fontFamily: `'Space Grotesk', sans-serif` }}
      >
        {walletConnected ? (
          ergoPay ? (
            <Button
              type="primary"
              size="large"
              ghost
              style={{
                color: 'white',
                border: '1px solid #434343',
                fontFamily: `'Vela Sans', sans-serif`,
                background: '#1D1D1D !important',
              }}
              className="flex items-center"
            >
              <div className="flex">
                <button
                  style={{
                    color: 'white',
                    borderRadius: 5,
                    background: '#1D1D1D !important',
                    marginLeft: 10,
                    padding: '3px 10px',
                    fontFamily: `'Vela Sans', sans-serif`,
                  }}
                >
                  <div className="flex">
                    <Image alt="img" width="25" src={ErgoLogoWhite} />
                    <div style={{ fontFamily: `'Vela Sans', sans-serif` }}>
                      {walletBtnAddress}
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
                color: 'white',
                border: '1px solid #434343',
                fontFamily: `'Vela Sans', sans-serif`,
                // background: '#1D1D1D',
              }}
              className="flex items-center"
            >
              <div className="flex">
                <span
                  style={{
                    color:'black',
                    padding: '3px 0px',
                    fontFamily: `'Vela Sans', sans-serif`,
                  }}
                >
                  {numberWithCommas(parseInt(ergBalance), 9)} ERG
                </span>
                <button
                  style={{
                    borderRadius: 5,
                    background: '#FAFAFA',
                    color:'black',
                    marginLeft: 10,
                    padding: '3px 10px',
                    fontFamily: `'Vela Sans', sans-serif !important`,
                  }}
                >
                  <div
                    className="flex"
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
                      {walletBtnAddress}
                    </div>
                  </div>
                </button>
              </div>
            </Button>
          )
        ) : (
            <button
                    type="button"
                    className="focus:outline-none text-white primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300 font-medium rounded text-md px-3 sm:px-5 py-2 sm:py-2.5"
                >
                    CONNECT WALLET
                </button>

        )}
      </Space>

      {/*main modal*/}
      <Modal
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
        open={isNautilusOpen}
        onOk={handleNautilusOk}
        onCancel={handleNautilusCancel}
        footer={null}
        style={{ fontFamily: `'Space Grotesk', sans-serif`, maxWidth: 464 }}
      >
        {ergoPay ? (
          <div style={{ fontFamily: `'Space Grotesk', sans-serif` }}>
            <div style={{display: 'flex',
              alignItems: 'center'}}>
              <Image alt="img" height="32" width="32" src={ErgoLogoWhite} />
              <h3 className="ms-3 m-0">ErgoPay</h3>
            </div>
            <div>
              <p
                className="mb-2 mt-4"
                style={{ fontFamily: `'Vela Sans', sans-serif` }}
              >
                Total balance
              </p>
            </div>
            <div
                style={{display: 'flex',
                  alignItems: 'center',  justifyContent: 'space-between'}}
              className={`${commonStyle.ergoBalanceDiv}`}
            >
              <div style={{display: 'flex',
                alignItems: 'center'}}>
                <ErgoIcon />
                <p className={commonStyle.ergoBalanceText}>
                  {numberWithCommas(parseInt(ergBalance), 9)} ERG
                </p>
              </div>
              <div>
                <p className="m-0">${numberWithCommas(parseInt(ergBalance), 9)}</p>
              </div>
            </div>
            <div>
              <p
                className="mb-2 mt-4"
                style={{ fontFamily: `'Vela Sans', sans-serif` }}
              >
                Active address
              </p>
            </div>
            <div
                style={{display: 'flex',
                  alignItems: 'center',  justifyContent: 'space-between'}}
              className={`${commonStyle.ergoBalanceDiv}`}
            >
              <p className={commonStyle.ergoBalanceAdd}>
                {defaultAddress?.slice(0, 18) +
                  '...' +
                  defaultAddress?.slice(-8)}
              </p>
              <div className="flex">
                <div className="mr-3 cursor-pointer">
                  <CopyToClipboard
                    text={textToCopy}
                    onCopy={(e) => handleCopyText(e)}
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
                    href={externalLink}
                    target="_blank"
                    style={{ color: 'white' }}
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
            <DisconnectNautilusWalletButton
              disconnectWallet={disconnectWallet}
              setIsNautilusOpen={setIsNautilusOpen}
            />
          </div>
        ) : (
          <div style={{ fontFamily: `'Space Grotesk', sans-serif` }}>
            <div style={{display: 'flex',
              alignItems: 'center'}}>
              <Image alt="img" height="32" width="32" src={NautilusLogo} />
              <h5 className="ms-3 m-0">Nautilus Wallet</h5>
            </div>

            <div>
              <p
                className="mb-2 mt-4"
                style={{ fontFamily: `'Vela Sans', sans-serif` }}
              >
                Total balance
              </p>
            </div>
            <div
                style={{display: 'flex',
                  alignItems: 'center',  justifyContent: 'space-between'}}
              className={`${commonStyle.ergoBalanceDiv}`}
            >
              <div style={{display: 'flex',
                alignItems: 'center'}}>
                <ErgoIconModal />
                <p className={commonStyle.ergoBalanceText}>
                  {numberWithCommas(parseInt(ergBalance), 9)} ERG
                </p>
              </div>
              <div>
                <p className="m-0">${ergUSDValue}</p>
              </div>
            </div>

            <div>
              <p
                className="mb-2 mt-4"
                style={{ fontFamily: `'Vela Sans', sans-serif` }}
              >
                Active address
              </p>
            </div>
            <div
              className={`flex align-items-center justify-between ${commonStyle.ergoBalanceDiv}`}
            >
              <div>
                <p className={commonStyle.ergoBalanceAdd}>
                  {defaultAddress?.slice(0, 18) +
                    '...' +
                    defaultAddress?.slice(-8)}
                </p>
              </div>

              <div className="flex">
                <div className="mr-3 cursor-pointer">
                  <CopyToClipboard
                    text={textToCopy}
                    onCopy={(e) => handleCopyText(e)}
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
                    href={externalLink}
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
            {walletData.length > 0 && (
              <div>
                <p
                  className="mb-2 mt-4"
                  style={{ fontFamily: `'Vela Sans', sans-serif` }}
                >
                  Tokens
                </p>
              </div>
            )}

            <div
              style={
                walletData.length > 4
                  ? { maxHeight: 275, overflowY: 'scroll' }
                  : undefined
              }
            >
              {walletData.map((item: Token) => (
                <div
                  key={item.tokenId}
                  style={{display: 'flex',
                    alignItems: 'center',  justifyContent: 'space-between'}}
                  className={`${commonStyle.ergoTokenBalanceDiv}`}
                >
                  <div style={{display: 'flex',
                    alignItems: 'center'}} >
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
                        // color: '#A6A6A6',
                        color: 'black',
                      }}
                    >
                      ${item.usdValue === 0 ? '0.00' : item.usdValue}
                    </small>
                  </div>
                </div>
              ))}
            </div>

            <DisconnectNautilusWalletButton
              disconnectWallet={disconnectWallet}
              setIsNautilusOpen={setIsNautilusOpen}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default ConnectWallet;
