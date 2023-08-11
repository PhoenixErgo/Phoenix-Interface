import React from "react";
import SettingPopup from "./SettingPopup";
import { Logo } from "./Logo";
import ConnectWallet from "@/components/wallet/ConnectWallet";
import DropDown from "@/components/wallet/DropDown";

interface IProps {
  activeTab: string;
  setActiveTab: Function;
}

const Navbar = (props: IProps) => {
  const { activeTab, setActiveTab } = props;
  return (
    <>
      <nav className="flex container items-center justify-between mx-auto px-3 lg:px-5 py-4">
        <Logo />

        <div className="flex items-center space-x-4">
          <SettingPopup />
            <DropDown/>
          {/*<button*/}
          {/*  type="button"*/}
          {/*  className="focus:outline-none text-white primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300 font-medium rounded text-md px-3 sm:px-5 py-2 sm:py-2.5"*/}
          {/*  onClick={() => getWalletConnection()}*/}
          {/*>*/}
          {/*  CONNECT WALLET*/}
          {/*</button>*/}
            <ConnectWallet />
        </div>
      </nav>
      <div className="primary-gradient w-full py-3 text-center flex items-center space-x-12 sm:space-x-20 justify-center">
        <button
          onClick={() => setActiveTab("hodlerg")}
          className={`text-white font-medium text-lg uppercase transition-all duration-200 ease-in-out after:transition-all
           after:ease-in-out after:duration-200 relative after:absolute after:-bottom-[11px] after:left-1/2 after:-translate-x-1/2 after:bg-white after:h-1 ${
             activeTab === "hodlerg" ? "after:w-[130%] " : "after:w-0"
           }`}
        >
          HODLERG 3%
        </button>
        <button
          onClick={() => setActiveTab("refund")}
          className={`text-white font-medium text-lg uppercase transition-all duration-200 ease-in-out after:transition-all
           after:ease-in-out after:duration-200 relative after:absolute after:-bottom-[11px] after:left-1/2 after:-translate-x-1/2 after:bg-white after:h-1 ${
             activeTab === "refund" ? "after:w-[130%] " : ""
           }`}
        >
          Refund
        </button>
      </div>
    </>
  );
};

export default Navbar;