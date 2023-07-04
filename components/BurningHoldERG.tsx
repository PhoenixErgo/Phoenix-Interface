import React from "react";

const BurningHoldERG = () => {
  return (
    <>
      <div className="max-w-md mx-auto">
        <h4 className="text-black text-xl font-medium">Minting hodlERG</h4>
        <p className="text-black my-3">
          Mint hodlERG with no fees. You have the freedom to mint as much as you
          desire at the current price. it's important to note that the minting
          process does not directly affect the token's pricing dynamics.
        </p>

        <div className="flex bg-gray-200 shadow-lg justify-between rounded-md items-start h-full">
          <div className="flex flex-col w-full h-full">
            <input
              className="w-full border-b-2 border-l-0 border-r-0 border-t-0 border-gray-300 bg-transparent text-gray-500 font-medium text-md h-14 focus:outline-none focus:ring-0 focus:border-primary focus-within:outline-none focus-within:shadow-none focus:shadow-none pl-4"
              placeholder="Amount"
              type="text"
            />
            <span className="text-black font-medium text-md pl-4 mt-2">
              0 ERG
            </span>
          </div>

          <button className="h-24 whitespace-nowrap focus:outline-none text-white primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300  focus:shadow-none font-medium rounded text-md px-5 py-2.5">
            MINT HODLERG
          </button>
        </div>
      </div>
    </>
  );
};

export default BurningHoldERG;
