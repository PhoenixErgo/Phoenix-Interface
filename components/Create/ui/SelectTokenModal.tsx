import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import TokenItem from "./TokenItem";
import { createFormData } from "../../../types/front";

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

    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        // TODO: get a list of avaliable tokens
    }, [])


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

                        <div className="mt-6 flex justify-end space-x-4">
                            {/* TODO: map list of tokens here: */}
                            <TokenItem />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SelectTokenModal;