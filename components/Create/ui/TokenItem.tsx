import React, { ChangeEvent } from 'react';
import { createFormData } from "../../../types/front";

interface TokenItemProps {
    createFormData: createFormData;
    setCreateFormData: React.Dispatch<React.SetStateAction<createFormData>>;
    displaySelectTokenModal: boolean;
    setDisplaySelectTokenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const TokenItem: React.FC<TokenItemProps> = ({
    createFormData,
    setCreateFormData,
    displaySelectTokenModal,
    setDisplaySelectTokenModal }) => {

    const handleTokenClick = () => {
        setDisplaySelectTokenModal(!displaySelectTokenModal);
        console.log("Token Click!")
    }

    return (
        <div className="w-full relative cursor-pointer hover:bg-gray-100 rounded flex justify-between p-5" onClick={handleTokenClick}>
            <div className="">Token Logo</div>
            <div className="">Token Tiker</div>
            <div className="">Token Title</div>
        </div>
    );
};

export default TokenItem;
