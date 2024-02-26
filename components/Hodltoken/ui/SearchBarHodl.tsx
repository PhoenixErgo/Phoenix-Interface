import React, { ChangeEvent } from 'react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="relative w-3/4">
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-red-600"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-6 absolute right-1 top-2/3 transform -translate-y-1/2 text-gray-500"
        fill="none"
        viewBox="0 0 28 28"
        stroke="currentColor"
      >
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
      </svg>
    </div>
  );
};

export default SearchBar;
