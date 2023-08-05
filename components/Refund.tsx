import React from "react";

const Refund = () => {
  return (
    <>
      <div className="flex items-center justify-center py-8 lg:py-12 min-h-[70vh]">
        <div className="max-w-md mx-auto">
          <h2 className="text-black font-bold text-3xl mb-5 lg:mb-8">Refund</h2>
          <div className="my-3">
            <label
              htmlFor="Proxy-address"
              className="text-black text-base font-medium"
            >
              Proxy address
            </label>
            <input
              className="w-full px-0 border-b-2 border-l-0 border-r-0 border-t-0 border-gray-300 bg-transparent text-gray-500 font-medium text-md h-14 focus:outline-none focus:ring-0 focus:border-primary focus-within:outline-none focus-within:shadow-none focus:shadow-none"
              placeholder="Proxy address"
              type="text"
            />
          </div>

          <div className="mt-3 mb-6">
            <label
              htmlFor="Proxy-address"
              className="text-black text-base font-medium"
            >
              Transaction ID
            </label>
            <input
              className="w-full px-0 border-b-2 border-l-0 border-r-0 border-t-0 border-gray-300 bg-transparent text-gray-500 font-medium text-md h-14 focus:outline-none focus:ring-0 focus:border-primary focus-within:outline-none focus-within:shadow-none focus:shadow-none"
              placeholder="Enter the Transaction ID"
              type="text"
            />
          </div>
          <button className="w-full focus:outline-none text-white primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300 font-medium rounded text-md  px-4 py-3">
            Get Refund
          </button>
        </div>
      </div>
    </>
  );
};

export default Refund;
