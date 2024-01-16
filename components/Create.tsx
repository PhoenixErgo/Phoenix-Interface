import React from "react";
import HeaderCards from "./HeaderCards";
import MintingHodlERG from "./MintingHodlERG";
import BurningHoldERG from "./BurningHoldERG";

interface IProps {
    ergdata: any;
}
const Create = (props: IProps) => {
    const { ergdata } = props;

    return (
        <>
            <div className="min-h-[70vh]">
                <div className="lg:flex items-start px-2 sm:px-3 my-10 lg:my-20">
                    {/* <MintingHodlERG /> */}
                    <BurningHoldERG />
                </div>
            </div>
        </>
    );
};

export default Create;
