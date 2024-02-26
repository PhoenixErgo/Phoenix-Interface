import React, { useState, useEffect, useRef } from "react";
import SearchBar from "./SearchBar";
import TokenItem from "./TokenItem";
import { createFormData } from "@/types/front";
import axios from "axios";

interface CreationToken {
    tokenId: string;
    ticker: string;
    tokenName: string;
    imgPath: string;
}

export const tokens: CreationToken[] = [
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
    {
        tokenId: "08e45c055160017c6346680b1400789e28a0d2d897f483535fe6b1baa6852f00",
        ticker: "HUSD",
        tokenName: "hodlUSD",
        imgPath: "https://raw.githubusercontent.com/alephium/token-list/master/logos/TUSDT.png",
    },
];

export const testnetTokens: CreationToken[] = [
    {
        tokenId: "accf5a8446669a4597c7673c58e455e0dfc39a794b90801948e11bbddc577f00",
        ticker: "HUSD",
        tokenName: "hodlUSD",
        imgPath: "https://raw.githubusercontent.com/alephium/token-list/master/logos/TUSDT.png",
    },
]

interface Token {
    tokenId: string;
    ticker: string;
    tokenName: string;
    imgPath: string;
}
interface SelectTokenModalProps {
    network: string | null,
    createFormData: createFormData;
    setCreateFormData: React.Dispatch<React.SetStateAction<createFormData>>;
    displaySelectTokenModal: boolean;
    setDisplaySelectTokenModal: React.Dispatch<React.SetStateAction<boolean>>;
}



const SelectTokenModal: React.FC<SelectTokenModalProps> = ({
    network,
    createFormData,
    setCreateFormData,
    displaySelectTokenModal,
    setDisplaySelectTokenModal,
}) => {

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchedTokens, setSearchedTokens] = useState<Token[]>([]);

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Filter tokens based on ticker when searchQuery changes

        switch (network) {
            case '1':
            case '3':
            default: {
                const filteredTokens = tokens.filter((token) =>
                    token.ticker.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setSearchedTokens(filteredTokens);
                break;
            }
            case '4': {
                axios.get('https://raw.githubusercontent.com/alephium/token-list/master/tokens/mainnet.json').then(res => {
                    const alephiumTokens: CreationToken[] = res.data.tokens.map((item: { id: string; symbol: string; name: string; logoURI: string; }) => {
                        return {
                            tokenId: item.id,
                            ticker: item.symbol,
                            tokenName: item.name,
                            imgPath: item.logoURI
                        }
                    })

                    const filteredTokens = alephiumTokens.filter((token) =>
                        token.ticker.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    setSearchedTokens([tokens[5]].concat(filteredTokens));
                });
                break;
            }
            case '5': {
                axios.get('https://raw.githubusercontent.com/alephium/token-list/master/tokens/testnet.json').then(res => {
                    const tokens: CreationToken[] = res.data.tokens.map((item: { id: string; symbol: string; name: string; logoURI: string; }) => {
                        return {
                            tokenId: item.id,
                            ticker: item.symbol,
                            tokenName: item.name,
                            imgPath: item.logoURI
                        }
                    })

                    const filteredTokens = tokens.filter((token) =>
                        token.ticker.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    setSearchedTokens([testnetTokens[0]].concat(filteredTokens));
                });
                break;
            }
        }

    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setDisplaySelectTokenModal(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setDisplaySelectTokenModal]);



    return (
        <>
            {/* Background Overlay */}
            {displaySelectTokenModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    {/* Modal Container */}
                    <div
                        ref={modalRef}
                        className="w-full h-3/4 bg-white p-5 max-w-md mx-auto rounded-md shadow-lg">
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

                        <div className="w-full h-4/5 mt-6 overflow-y-scroll flex flex-col justify-start">
                            {searchedTokens.map((token) => (
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
