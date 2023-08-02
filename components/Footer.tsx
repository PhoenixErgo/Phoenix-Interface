import React from "react";
import { LogoFooter } from "./Logo";
import KnowYourAssumptionsModal from "./KnowYourAssumptionsModal";

const Footer = () => {
  return (
    <>
      <footer className="primary-gradient py-8 lg:py-10">
        <div className="grid w-full text-white place-content-center gap-4 lg:gap-5 grid-cols-2 lg:grid-cols-4 container mx-auto  px-3 lg:px-5">
          <div>
            <LogoFooter />
            <p className="mt-[18px] lg:ml-4 ">Phoenix Team</p>
          </div>
          <div>
            <h4 className="font-bold uppercase pb-3 ">Open Source</h4>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://github.com/K-Singh/Sigma-Finance"
                  className="transition-all duration-200 ease-in-out hover:text-opacity-80"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contracts
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/capt-nemo429/sigmafi-ui"
                  className="transition-all duration-200 ease-in-out hover:text-opacity-80"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  User Interface
                </a>
              </li>

              <li>
                <a
                  href="https://github.com/capt-nemo429/sigmafi-ui/blob/main/src/offchain/plugins.ts"
                  className="transition-all duration-200 ease-in-out hover:text-opacity-80"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Off-chain Plugins
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase pb-3">Social</h4>
            <ul className="space-y-1.5">
              <li>
                <a
                  className="transition-all duration-200 ease-in-out hover:text-opacity-80"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://twitter.com/nautiluswallet"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/capt-nemo429"
                  className="transition-all duration-200 ease-in-out hover:text-opacity-80"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase pb-3">KYA</h4>
            <ul className="space-y-1.5">
              <li>
                <KnowYourAssumptionsModal />
              </li>
              <li>
                <a
                  href="https://sigmafi.gitbook.io/sigmafi-docs/"
                  target="_blank"
                  className="transition-all duration-200 ease-in-out hover:text-opacity-80"
                  rel="noopener noreferrer"
                >
                  Docs
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
