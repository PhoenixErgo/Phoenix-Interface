// pages/api/ergdata.ts

import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simulate fetching the data from your API
  const ergdata = {
    currentprice: "0.000",
    circulatingsupply: "97,090,373,01",
    tvl: 1,
  };

  res.status(200).json(ergdata);
}
