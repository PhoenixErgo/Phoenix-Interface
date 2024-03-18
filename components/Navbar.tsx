import React from 'react';
import SettingPopup from './SettingPopup';
import { Logo } from './Logo';
import ConnectWallet from '@/components/wallet/ConnectWallet';
import DropDown from '@/components/wallet/DropDown';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { AlephiumConnectButton } from '@alephium/web3-react';
import { getTicker } from '@/common/utils';

interface IProps {
  activeTab: string;
  setActiveTab: Function;
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
  network: string | null;
}

function getNetworkComponent(
  network: string | null,
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined
) {
  switch (network) {
    case '1':
    case '3':
    default:
      return <ConnectWallet socket={socket} />;
    case '4':
    case '5':
    case '6':
      return <AlephiumConnectButton />;
  }
}

const Navbar = (props: IProps) => {
  const { activeTab, setActiveTab, socket, network } = props;
  return (
    <>
      <nav className="flex container items-center justify-between mx-auto px-2 sm:px-3 lg:px-5 py-4">
        <span className="mr-3">
          <Logo />
        </span>

        <div className="flex items-center space-x-3 sm:space-x-4">
          {!network || network === '1' ? <SettingPopup /> : null}
          <DropDown />

          <div className="hidden sm:block">{getNetworkComponent(network, socket)}</div>
        </div>
      </nav>

      <div className="sm:hidden w-full ">{getNetworkComponent(network, socket)}</div>
      <div className="primary-gradient w-full py-3 text-center grid grid-cols-[1fr_1fr] md:grid-cols-4 gap-4 items-center space-x-12 sm:space-x-20 justify-center">
        <button
          onClick={() => setActiveTab('hodl')}
          className={`text-white font-medium font-inter text-lg uppercase transition-all duration-200 ease-in-out after:transition-all
           after:ease-in-out after:duration-200 relative after:absolute after:-bottom-[11px] after:left-1/2 after:-translate-x-1/2 after:bg-white after:h-1 ${
             activeTab === 'hodl' ? 'after:w-[130%] ' : 'after:w-0'
           }`}
        >
          {`HODL${getTicker(network)} 3%`}
        </button>
        {/*{!network || network === '1' || network === '3' ? null : (*/}
        {/*  <button*/}
        {/*    onClick={() => setActiveTab('hodltoken')}*/}
        {/*    className={`text-white font-medium font-inter text-lg uppercase transition-all duration-200 ease-in-out after:transition-all*/}
        {/*   after:ease-in-out after:duration-200 relative after:absolute after:-bottom-[11px] after:left-1/2 after:-translate-x-1/2 after:bg-white after:h-1 ${*/}
        {/*     activeTab === 'hodltoken' ? 'after:w-[130%] ' : 'after:w-0'*/}
        {/*   }`}*/}
        {/*  >*/}
        {/*    HODLTOKEN*/}
        {/*  </button>*/}
        {/*)}*/}
        {!network || network === '1' || network === '3' ? (
          <button
            onClick={() => setActiveTab('refund')}
            className={`text-white font-medium font-inter text-lg uppercase transition-all duration-200 ease-in-out after:transition-all
           after:ease-in-out after:duration-200 relative after:absolute after:-bottom-[11px] after:left-1/2 after:-translate-x-1/2 after:bg-white after:h-1 ${
             activeTab === 'refund' ? 'after:w-[130%] ' : ''
           }`}
          >
            Refund
          </button>
        ) : null}
        {/*{!network || network === '1' || network === '3' ? null : (*/}
        {/*  <button*/}
        {/*    onClick={() => setActiveTab('create')}*/}
        {/*    className={`text-white font-medium font-inter text-lg uppercase transition-all duration-200 ease-in-out after:transition-all*/}
        {/*   after:ease-in-out after:duration-200 relative after:absolute after:-bottom-[11px] after:left-1/2 after:-translate-x-1/2 after:bg-white after:h-1 ${*/}
        {/*     activeTab === 'create' ? 'after:w-[130%] ' : ''*/}
        {/*   }`}*/}
        {/*  >*/}
        {/*    Create*/}
        {/*  </button>*/}
        {/*)}*/}
      </div>
    </>
  );
};

export default Navbar;
