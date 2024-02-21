import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import TokenItem from "./TokenItem";
import { createFormData } from "../../../types/front";
// import { tokens } from './../../../assest/tokens';
import rsADAimg from "./token_icons/rsADA.svg";
import RSNimg from "./../../../public/token_icons/rsn.webp";

export const tokens = [
    {
        tokenId: "",
        ticker: "ERG",
        tokenName: "ERGO",
        imgPath: "./token_icons/ergo.svg",
    },
    {
        tokenId: "0cd8c9f416e5b1ca9f986a7f10a84191dfb85941619e49e53c0dc30ebf83324b",
        ticker: "COMET",
        tokenName: "Comet",
        imgPath: "/token_icons/comet.svg",
    },
    {
        tokenId: "03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04",
        ticker: "SigUSD",
        tokenName: "SigmaUSD",
        imgPath: "/token_icons/sigUSD.svg",
    },
    {
        tokenId: "8b08cdd5449a9592a9e79711d7d79249d7a03c535d17efaee83e216e80a44c4b",
        ticker: "RSN",
        tokenName: "Rosen",
        imgPath: "/token_icons/rsn.webp",
    },
    {
        tokenId: "e023c5f382b6e96fbd878f6811aac73345489032157ad5affb84aefd4956c297",
        ticker: "rsADA",
        tokenName: "rsADA",
        imgPath: "/token_icons/rsADA.svg",
    },
];

interface Token {
    tokenId: string;
    ticker: string;
    tokenName: string;
    imgPath: string;
}
interface SelectTokenModalProps {
    createFormData: createFormData;
    setCreateFormData: React.Dispatch<React.SetStateAction<createFormData>>;
    displaySelectTokenModal: boolean;
    setDisplaySelectTokenModal: React.Dispatch<React.SetStateAction<boolean>>;
}



const SelectTokenModal: React.FC<SelectTokenModalProps> = ({
    createFormData,
    setCreateFormData,
    displaySelectTokenModal,
    setDisplaySelectTokenModal,
}) => {

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchedTokens, setSearchedTokens] = useState<Token[]>([]);

    useEffect(() => {
        // Filter tokens based on ticker when searchQuery changes
        const filteredTokens = tokens.filter((token) =>
            token.ticker.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchedTokens(filteredTokens);
    }, [searchQuery]);



    return (
        <>
            {/* Background Overlay */}
            {displaySelectTokenModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    {/* Modal Container */}
                    <div className="w-full bg-white p-5 max-w-md mx-auto rounded-md shadow-lg">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Select a token</h2>
                            {/* Close Button */}
                            <button
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                onClick={() => setDisplaySelectTokenModal(false)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <SearchBar
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery} />

                        <div className="w-full mt-6 flex flex-col justify-start">
                            {searchedTokens?.map((token) => (
                                <TokenItem
                                    key={token.tokenId}
                                    tokenId={token.tokenId}
                                    ticker={token.ticker}
                                    tokenName={token.tokenName}
                                    img={token.imgPath}
                                    createFormData={createFormData}
                                    setCreateFormData={setCreateFormData}
                                    displaySelectTokenModal={displaySelectTokenModal}
                                    setDisplaySelectTokenModal={setDisplaySelectTokenModal}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SelectTokenModal;
