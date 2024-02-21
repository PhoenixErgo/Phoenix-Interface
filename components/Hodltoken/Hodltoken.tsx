import React, { useState, useEffect } from "react";
import HeaderCardsV2 from "../HeaderCardsV2";
import MintingHodlTOKEN from "./ui/MintingHodlTOKEN";
import BurningHoldTOKEN from "./ui/BurningHodlTOKEN";
import DepositingHoldTOKEN from "./ui/DepositingHodlTOKEN";
import SearchBarHodl from "./ui/SearchBarHodl";

import commonStyle from '../../styles/common.module.css';
import Image from 'next/image';
import filter_icon from '../../assest/images/checkout/filter_icon.svg';
import filter_icon_descend from '../../assest/images/checkout/filter_icon_descend.svg';

interface IProps {
    ergdata: any;
}

interface HodlToken {
    id: number;
    token: string;
    title: string;
    bankFee: number;
}

const tokenData = [
    { id: 1001, token: "COMMET", title: "hodlCOMMET", bankFee: 3 },
    { id: 1002, token: "SigUSD", title: "hodlSigUSD", bankFee: 4 },
    { id: 1003, token: "SigUSD", title: "hodlSigUSD", bankFee: 14 },
    { id: 1004, token: "SPF", title: "hodlSPF", bankFee: 2 },
    { id: 1005, token: "SPF", title: "hodlSPF", bankFee: 20 },
    { id: 1006, token: "SPF", title: "hodlSPF", bankFee: 7 },
    { id: 1007, token: "SPF", title: "hodlSPF", bankFee: 10 },
    // Add more tokens if needed
];


const Hodltoken = (props: IProps) => {
    const { ergdata } = props;
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [tokensList, setTokensList] = useState<HodlToken[]>(tokenData);
    const [ascendingOrder, setAscendingOrder] = useState<boolean>(true);


    const sortTokens = () => {
        const sortedTokens = [...tokenData]
            .filter((token) => token.token.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => (ascendingOrder ? a.bankFee - b.bankFee : b.bankFee - a.bankFee));
        setTokensList(sortedTokens);
    };

    useEffect(() => {
        sortTokens();
    }, [ascendingOrder, searchQuery]);

    return (
        <div className="flex flex-col items-center mt-20">
            <div className="relative bg-gray-200 shadow-lg flex content-between items-center rounded-md w-[350px] lg:w-[800px]">
                <SearchBarHodl searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <div
                    onClick={() => setAscendingOrder(!ascendingOrder)}
                    className="w-1/4 flex items-center justify-center cursor-pointer text-center text-xs lg:text-lg lg:font-bold"
                >
                    Bank Fee
                    <span className="pl-2">
                        {ascendingOrder ?
                            <Image alt='img' src={filter_icon_descend} className={commonStyle.tokenIconImg} height='20' width='20' /> :
                            <Image alt='img' src={filter_icon} className={commonStyle.tokenIconImg} height='20' width='20' />}
                    </span>
                </div>
            </div>

            {tokensList.map(({ id, token, title, bankFee }) => (
                <div key={id} className="max-w-l mx-auto font-inter my-10 mx-20">
                    <div className="bg-gray-200 shadow-lg flex content-between rounded-md w-[350px] lg:w-[800px]  flex-col lg:flex-row p-2">
                        <div className="container mx-auto flex flex-col justify-between">
                            <div className="text-black mt-5 text-center text-2xl font-extrabold text-red-800">{title} {bankFee}%</div>
                            <HeaderCardsV2
                                title="Price"
                                amount={ergdata.currentPrice}
                                token={token}
                            />
                            <HeaderCardsV2
                                title="Supply"
                                amount={ergdata.circulatingSupply}
                                token={`hodl${token}`}
                            />
                            <HeaderCardsV2
                                title="Reserve"
                                amount={ergdata.tvl}
                                token={token}
                            />
                        </div>
                        <div className="container mx-auto border lg:border-l-gray-300 flex flex-col items-center justify-between">
                            <MintingHodlTOKEN token={token} />
                            <BurningHoldTOKEN token={`hodl${token}`} />
                            <DepositingHoldTOKEN token={token} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};


export default Hodltoken;
