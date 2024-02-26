import React, { ChangeEvent } from 'react';
import { createFormData } from "@/types/front";

interface TokenItemProps {
    tokenId: string;
    ticker: string;
    tokenName: string;
    img: any;
    createFormData: createFormData;
    setCreateFormData: React.Dispatch<React.SetStateAction<createFormData>>;
    displaySelectTokenModal: boolean;
    setDisplaySelectTokenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const TokenItem: React.FC<TokenItemProps> = ({
    tokenId,
    ticker,
    tokenName,
    img,
    createFormData,
    setCreateFormData,
    displaySelectTokenModal,
    setDisplaySelectTokenModal }) => {

    const handleTokenClick = () => {
        // console.log("Token Click!")
        setCreateFormData({
            ...createFormData,
            tokenId: tokenId,
            ticker: ticker,
            tokenName: tokenName,
            img: img,
        });
        setDisplaySelectTokenModal(!displaySelectTokenModal);
    }

    return (
        <div className="w-full relative cursor-pointer hover:bg-gray-100 rounded flex justify-between items-center p-5" onClick={handleTokenClick}>
            <img className='w-6 h-6' src={img} alt="Token Img" />
            <div className="flex-grow">{ticker}</div>
            <div className="flex-grow">{tokenName}</div>
        </div>
    );
};

export default TokenItem;
