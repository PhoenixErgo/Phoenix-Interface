import React from "react";
import HeaderCardsV2 from "../HeaderCardsV2";
import MintingHodlTOKEN from "./ui/MintingHodlTOKEN";
import BurningHoldTOKEN from "./ui/BurningHodlTOKEN";
import DepositingHoldTOKEN from "./ui/DepositingHodlTOKEN";


interface IProps {
    ergdata: any;
}
const Hodltoken = (props: IProps) => {
    const { ergdata } = props;

    return (
        <>
            <div className="max-w-l mx-auto font-inter min-h-[70vh] my-10 mx-20">
                <div className="bg-gray-200 shadow-lg flex content-between rounded-md">
                    <div className="container mx-auto flex flex-col justify-between">
                        <div className="text-black mt-5 text-center text-2xl font-extrabold text-red-800">HODLTOKEN</div>
                        <HeaderCardsV2
                            title="Price"
                            amount={ergdata.currentPrice}
                            token="ERG"
                        />
                        <HeaderCardsV2
                            title="Supply"
                            amount={ergdata.circulatingSupply}
                            token="hodlERG"

                        />
                        <HeaderCardsV2
                            title="Reserve"
                            amount={ergdata.tvl}
                            token="ERG"
                        />
                    </div>
                    <div className="container mx-auto border border-l-gray-300 flex flex-col items-center justify-between">
                        <MintingHodlTOKEN />
                        <BurningHoldTOKEN />
                        <DepositingHoldTOKEN />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Hodltoken;
