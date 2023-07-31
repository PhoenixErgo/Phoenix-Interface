import React, { useEffect, useState } from 'react';
import HeaderCards from './HeaderCards';
import { Logo } from './Logo';
import MintingHodlERG from './MintingHodlERG';
import BurningHoldERG from './BurningHoldERG';
import Loader from './Loader';
import ConnectWallet from './wallet/ConnectWallet';

interface ErgData {
    currentprice: string;
    circulatingsupply: string;
    tvl: number;
}

const Main = () => {
    const [ergdata, setErgData] = useState<ErgData | null>(null);

    useEffect(() => {
        fetch('/api/ergdata')
            .then(response => response.json())
            .then(data => setErgData(data))
            .catch(error => console.error(error));
    }, []);

    if (!ergdata) {
        return <Loader />;
    }

    return (
        <>
            <div className="flex container items-center justify-between mx-auto px-3 lg:px-5 py-4">
                <Logo />
                 <ConnectWallet />
                {/* <button
                    type="button"
                    className="focus:outline-none text-white primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300 font-medium rounded text-md px-3 sm:px-5 py-2 sm:py-2.5"
                >
                    CONNECT WALLET
                </button> */}
                {/* <ConnectWallet /> */}
            </div>
            {/*<ConnectWallet />*/}
            <div className="primary-gradient w-full py-3 text-center">
                <p className="border-bottom text-white font-medium text-lg uppercase relative after:absolute after:-bottom-[11px] after:left-1/2 after:-translate-x-1/2 after:w-[130%] after:bg-white after:h-1 inline-block">
                    HODLERG 3%
                </p>
            </div>
            <div className="container mx-auto px-3 lg:px-5 my-10 sm:flex items-center justify-between space-y-4 sm:space-x-4 xl:space-x-10">
                <HeaderCards title="Current price" text={`${ergdata.currentprice} ERG`} />
                <HeaderCards title="Circulating supply" text={`${ergdata.circulatingsupply} holdERG`} />
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
