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
            <div className="max-w-l mx-auto font-inter my-10 mx-20">
                <div className="bg-gray-200 shadow-lg flex content-between rounded-md">
                    <div className="container mx-auto flex flex-col justify-between">
                        <div className="text-black mt-5 text-center text-2xl font-extrabold text-red-800">hodlCOMMET 3%</div>
                        <HeaderCardsV2
                            title="Price"
                            amount={ergdata.currentPrice}
                            token="COMMET"
                        />
                        <HeaderCardsV2
                            title="Supply"
                            amount={ergdata.circulatingSupply}
                            token="hodlCOMMET"

                        />
                        <HeaderCardsV2
                            title="Reserve"
                            amount={ergdata.tvl}
                            token="COMMET"
                        />
                    </div>
                    <div className="container mx-auto border border-l-gray-300 flex flex-col items-center justify-between">
                        <MintingHodlTOKEN token="COMMET" />
                        <BurningHoldTOKEN token="hodlCOMMET" />
                        <DepositingHoldTOKEN token="COMMET" />
                    </div>
                </div>
            </div>
            <div className="max-w-l mx-auto font-inter my-10 mx-20">
                <div className="bg-gray-200 shadow-lg flex content-between rounded-md">
                    <div className="container mx-auto flex flex-col justify-between">
                        <div className="text-black mt-5 text-center text-2xl font-extrabold text-red-800">hodlSigUSD 4%</div>
                        <HeaderCardsV2
                            title="Price"
                            amount={ergdata.currentPrice}
                            token="SigUSD"
                        />
                        <HeaderCardsV2
                            title="Supply"
                            amount={ergdata.circulatingSupply}
                            token="hodlSigUSD"

                        />
                        <HeaderCardsV2
                            title="Reserve"
                            amount={ergdata.tvl}
                            token="SigUSD"
                        />
                    </div>
                    <div className="container mx-auto border border-l-gray-300 flex flex-col items-center justify-between">
                        <MintingHodlTOKEN token="SigUSD"/>
                        <BurningHoldTOKEN token="hodlSigUSD"/>
                        <DepositingHoldTOKEN token="SigUSD"/>
                    </div>
                </div>
            </div>
            <div className="max-w-l mx-auto font-inter my-10 mx-20">
                <div className="bg-gray-200 shadow-lg flex content-between rounded-md">
                    <div className="container mx-auto flex flex-col justify-between">
                        <div className="text-black mt-5 text-center text-2xl font-extrabold text-red-800">hodlSPF 10%</div>
                        <HeaderCardsV2
                            title="Price"
                            amount={ergdata.currentPrice}
                            token="SPF"
                        />
                        <HeaderCardsV2
                            title="Supply"
                            amount={ergdata.circulatingSupply}
                            token="hodlSPF"

                        />
                        <HeaderCardsV2
                            title="Reserve"
                            amount={ergdata.tvl}
                            token="SPF"
                        />
                    </div>
                    <div className="container mx-auto border border-l-gray-300 flex flex-col items-center justify-between">
                        <MintingHodlTOKEN token="SPF"/>
                        <BurningHoldTOKEN token="hodlSPF"/>
                        <DepositingHoldTOKEN token="SPF"/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Hodltoken;
