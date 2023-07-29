import {Configuration, DefaultApiFactory} from "@/blockchain/ergo/explorerApi";


export const isMainnet = false;
export const NODE_API_URL = (isMainnet: boolean): string => (
    isMainnet
        ? process.env.NEXT_PUBLIC_MAINNET_NODE_URL
        : process.env.NEXT_PUBLIC_TESTNET_NODE_URL
)!?.replace(/[\\/]+$/, '');
export const EXPLORER_API_URL = (isMainnet: boolean): string => (
    isMainnet
        ? process.env.NEXT_PUBLIC_MAINNET_API_URL
        : process.env.NEXT_PUBLIC_TESTNET_API_URL
)!?.replace(/[\\/]+$/, '');
export const EXPLORER_URL = (isMainnet: boolean): string => (
    isMainnet
        ? process.env.NEXT_PUBLIC_MAINNET_EXPLORER_URL
        : process.env.NEXT_PUBLIC_TESTNET_EXPLORER_URL
)!?.replace(/[\\/]+$/, '');

export const PROXY_ADDRESS = (isMainnet: boolean): string => (
    isMainnet
        ? process.env.NEXT_PUBLIC_PROXY_ADDRESS_MAINNET!
        : process.env.NEXT_PUBLIC_PROXY_ADDRESS_TESTNET!
)

export const HODL_ERG_TOKEN_ID = process.env.NEXT_PUBLIC_HODL_ERG!;
export const BANK_SINGLETON_TOKEN_ID = process.env.NEXT_PUBLIC_BANK_SINGLETON!;
export const MIN_TX_OPERATOR_FEE = process.env.NEXT_PUBLIC_MIN_TX_OPERATOR_FEE!;

export const UIMultiplier: bigint = BigInt(1e9);
export const precisionBigInt: bigint = BigInt(1000000);
export const precision: number = 1000000;

export const explorerClient = (isMainnet: boolean) => {
    const explorerConf = new Configuration({
        basePath: EXPLORER_API_URL(isMainnet),
    });
    return DefaultApiFactory(explorerConf);
}