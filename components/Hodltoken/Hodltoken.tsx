import React from "react";
import HeaderCards from "../HeaderCards";
import MintingHodlTOKEN from "./ui/MintingHodlTOKEN";
import BurningHoldTOKEN from "./ui/BurningHodlTOKEN";
import DepositingHoldTOKEN from "./ui/DepositingHodlToken";


interface IProps {
    ergdata: any;
}
const Hodltoken = (props: IProps) => {
    const { ergdata } = props;

    return (
        <>
            <div className="min-h-[70vh]">
                <h2 className="text-black font-bold text-3xl my-10 lg:mb-8 text-center">HODLTOKEN</h2>
                <div className="container mx-auto px-2 sm:px-3 lg:px-5 my-10 sm:flex items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 xl:space-x-10">
                    <HeaderCards
                        title="Current price"
                        text={`${ergdata.currentPrice} ERG`}
                    />
                    <HeaderCards
                        title="Emission amount"
                        text={`${ergdata.circulatingSupply} hodlERG`}
                    />
                    <HeaderCards title="TVL" text={`${ergdata.tvl} ERG`} />
                </div>
                <div className="container mx-auto px-2 sm:px-3 lg:px-5 my-10 sm:flex items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 xl:space-x-10">
                    <MintingHodlTOKEN />
                    <BurningHoldTOKEN />
                    <DepositingHoldTOKEN />
                </div>
            </div>
        </>
    );
};

export default Hodltoken;
