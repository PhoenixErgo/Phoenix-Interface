import React, { ChangeEvent } from 'react';

interface TokenItemProps {

}

const SearchBar: React.FC<TokenItemProps> = () => {

    const handleTokenClick = () => {
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

export default SearchBar;
