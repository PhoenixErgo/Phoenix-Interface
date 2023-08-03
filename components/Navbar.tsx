import React from "react";
import SettingPopup from "./SettingPopup";
import { Logo } from "./Logo";

const Navbar = () => {
  return (
    <>
      <nav className="flex container items-center justify-between mx-auto px-3 lg:px-5 py-4">
        <Logo />

        <div className="flex items-center space-x-4">
          <SettingPopup />
          <button
            type="button"
            className="focus:outline-none text-white primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300 font-medium rounded text-md px-3 sm:px-5 py-2 sm:py-2.5"
          >
            CONNECT WALLET
          </button>
        </div>
      </nav>
      <div className="primary-gradient w-full py-3 text-center">
        <p className="border-bottom text-white font-medium text-lg uppercase relative after:absolute after:-bottom-[11px] after:left-1/2 after:-translate-x-1/2 after:w-[130%] after:bg-white after:h-1 inline-block">
          HODLERG 3%
        </p>
      </div>
    </>
  );
};

export default Navbar;
