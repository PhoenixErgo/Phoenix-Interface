import axios from 'axios';
import {
  Configuration,
  DefaultApiFactory,
  OutputInfo,
  RegisterType,
  TokenInfo,
  TransactionInfo,
} from './explorerApi';
import { NodeApi } from './nodeApi/api';
import {
  ErgoTransaction,
  ErgoTransactionOutput,
  Registers,
} from '../../types/nodeApi';
import { isHex } from '@fleet-sdk/common';
import { toDate } from 'date-fns-tz';

export const SCALA_API_URL = (isMainnet: boolean) =>  (
  isMainnet
    ? process.env.NEXT_PUBLIC_SCALA_MAINNET_API
    : process.env.NEXT_PUBLIC_SCALA_TESTNET_API
)!?.replace(/[\\/]+$/, '');
export const NEXT_PUBLIC_NEST_API_URL = (isMainnet: boolean) =>  (
  isMainnet
    ? process.env.NEXT_PUBLIC_NEST_MAINNET_API
    : process.env.NEXT_PUBLIC_NEST_TESTNET_API
)!?.replace(/[\\/]+$/, '');

export const NODE_API_URL = (isMainnet: boolean) => (
  isMainnet
    ? process.env.NEXT_PUBLIC_NODE_MAINNET_API_URL
    : process.env.NEXT_PUBLIC_NODE_TESTNET_API_URL
)!?.replace(/[\\/]+$/, '');
export const EXPLORER_API_URL = (isMainnet: boolean) => (
  isMainnet
    ? process.env.NEXT_PUBLIC_EXPLORER_MAINNET_API_URL
    : process.env.NEXT_PUBLIC_EXPLORER_TESTNET_API_URL
)!?.replace(/[\\/]+$/, '');
export const EXPLORER_URL = (isMainnet: boolean) => (
  isMainnet
    ? process.env.NEXT_PUBLIC_EXPLORER_MAINNET_URL
    : process.env.NEXT_PUBLIC_EXPLORER_TESTNET_URL
)!?.replace(/[\\/]+$/, '');

export const ARIST_ADDRESS_CONSTANT: number = parseInt(
  process.env.NEXT_PUBLIC_ARIST_ADDRESS_CONSTANT!,
);
export const MINER_FEE_CONSTANT: number = parseInt(
  process.env.NEXT_PUBLIC_MINER_FEE_CONSTANT!,
);
export const COLLECTION_TOKEN_CONSTANT: number = parseInt(
  process.env.NEXT_PUBLIC_COLLECTION_TOKEN_CONSTANT!,
);
export const LILIUM_FEE_ADDRESS_CONSTANT: number = parseInt(
  process.env.NEXT_PUBLIC_LILIUM_FEE_ADDRESS_CONSTANT!,
);
export const LILIUM_FEE_VALUE_CONSTANT: number = parseInt(
  process.env.NEXT_PUBLIC_LILIUM_FEE_VALUE_CONSTANT!,
);
export const PRICE_OF_NFT_NANOERG_CONSTANT: number = parseInt(
  process.env.NEXT_PUBLIC_PRICE_OF_NFT_NANOERG_CONSTANT!,
);
export const PAYMENT_TOKEN_AMOUNT: number = parseInt(
  process.env.NEXT_PUBLIC_PAYMENT_TOKEN_AMOUNT_CONSTANT!,
);
export const TX_OPERATOR_FEE_CONSTANT: number = parseInt(
  process.env.NEXT_PUBLIC_TX_OPERATOR_FEE_CONSTANT!,
);
export const MIN_BOX_VALUE_CONSTANT: number = parseInt(
  process.env.NEXT_PUBLIC_MIN_BOX_VALUE_CONSTANT!,
);

export const minBoxCreationERG = 10 ** 6;

export async function rateLimitedCoinGeckoERGUSD(): Promise<
  () => Promise<number>
> {
  let timestamp = 0;
  let price = 0;

  async function getPrice(): Promise<number> {
    const ts = Date.now();

    if (ts >= timestamp) {
      timestamp = ts + 30000;
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=ergo&vs_currencies=USD',
        );
        price = response.data.ergo.usd;
        return response.data.ergo.usd;
      } catch (error) {
        // Handle error appropriately
        console.error('Error fetching ERG to USD conversion:', error);
        price = 0.0;
        return 0.0;
      }
    } else {
      return price;
    }
  }
  return getPrice;
}

export const getServiceConf = async (isMainnet: boolean): Promise<ServiceConf> => {
  const response = await axios.get(`${SCALA_API_URL(isMainnet)}/serviceConf`);
  return response.data as ServiceConf;
};

export const getContracts = async (isMainnet: boolean): Promise<ContractData> => {
  const response = await axios.get(`${SCALA_API_URL(isMainnet)}/getContracts`);
  return response.data as ContractData;
};

export async function submitData(data: any, isMainnet: boolean): Promise<CollectionSubmission> {
  const URL = `${SCALA_API_URL(isMainnet)}/submitCollection`;
  const response = await axios.post(URL, data);
  return response.data as CollectionSubmission;
}

export async function verifyData(data: any, isMainnet: boolean) {
  const URL = `${SCALA_API_URL(isMainnet)}/validateCollection`;
  const response = await axios.post(URL, data);
  return response.data;
}

export async function getUnConfirmedOrConfirmedTx(
  txId: string,
  isMainnet: boolean,
): Promise<TransactionInfo | ErgoTransaction> {
  const explorerConf = new Configuration({ basePath: EXPLORER_API_URL(isMainnet) });
  const explorerClient = DefaultApiFactory(explorerConf);
  const nodeApi = new NodeApi(NODE_API_URL(isMainnet));
  try {
    return await nodeApi.transactionsUnconfirmedByTransactionId(txId);
  } catch (error) {
    try {
      return (await explorerClient.getApiV1TransactionsP1(txId)).data;
    } catch (e) {
      return {} as TransactionInfo;
    }
  }
}

export function outputInfoToErgoTransactionOutput(
  output: OutputInfo,
): ErgoTransactionOutput {
  return {
    boxId: output.boxId,
    value: output.value,
    ergoTree: output.ergoTree,
    creationHeight: output.creationHeight,
    assets: output.assets!.map((token) => ({
      tokenId: token.tokenId,
      amount: token.amount,
    })),
    additionalRegisters: (
      Object.keys(output.additionalRegisters) as RegisterType[]
    ).reduce(
      (
        obj: Partial<Record<RegisterType, string>>,
        key: RegisterType,
      ): Registers => {
        if (output.additionalRegisters[key]) {
          obj[key] = output.additionalRegisters[key]?.serializedValue;
        }
        return obj;
      },
      {} as Partial<Record<RegisterType, string>>,
    ),
    transactionId: output.transactionId,
    index: output.index,
    spentTransactionId: output.spentTransactionId,
  };
}

export const isCustomTokenValid = async (
  tokenId: string,
  isMainnet: boolean,
  isCustomToken: boolean = true
): Promise<[boolean, TokenInfo]> => {
  if (isCustomToken) {
    const id = tokenId.trim();
    if (id === '' || !isHex(id) || id.length !== 64) {
      return [false, {} as TokenInfo];
    }
    const explorerConf = new Configuration({ basePath: EXPLORER_API_URL(isMainnet) });
    const explorerClient = DefaultApiFactory(explorerConf);
    try {
      const res = (await explorerClient.getApiV1TokensP1(id)).data;
      return [true, res];
    } catch (error) {
      return [false, {} as TokenInfo];
    }
  }
  return [true, {} as TokenInfo];
};

export const getDecimalCount = (num: string): number => {
  // Check if number has decimals
  if (num.indexOf('.') !== -1) {
    return num.split('.')[1].length;
  } else {
    return 0;
  }
};

export const convertToIsoStringIgnoringTimezone = (date: Date) => {
  const parts = date.toString().split(' ');
  function getMonth(monthName: string) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthNumber = months.indexOf(monthName) + 1;
    return monthNumber < 10 ? '0' + monthNumber : '' + monthNumber;
  }
  return `${parts[3]}-${getMonth(parts[1])}-${parts[2]}T${parts[4]}Z`;
}

export const addTimeZone = (date: string): Date => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return toDate(date, { timeZone: tz });
}

export const msToMinutes = (ms: number) => {
  const oneMinuteInMs = 60000;
  return Math.floor(ms / oneMinuteInMs);
};


export async function getShortLink(base64Txn: string): Promise<string | undefined> {
  try{
    const res = await axios.get(`${NEXT_PUBLIC_NEST_API_URL}/ergopay/generateShortLink/${base64Txn}`);
    const shortCode = res.data.shortCode;
    if(shortCode === 'null'){
      return undefined;
    }
    return `https://ergopay.liliumergo.io/${res.data.shortCode}`;
  } catch (error){
    console.log(error);
    return undefined;
  }
}
