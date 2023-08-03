import {Configuration, DefaultApiFactory} from "@/blockchain/ergo/explorerApi";
import {ErgoAddress, Network} from "@fleet-sdk/core";


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

export const PROXY_ADDRESS = (isMainnet: boolean): string => {
    const ergoTree = process.env.NEXT_PUBLIC_PROXY_ERGO_TREE!;
    return isMainnet ? ErgoAddress.fromErgoTree(ergoTree, Network.Mainnet).toString() : ErgoAddress.fromErgoTree(ergoTree, Network.Testnet).toString();
}

export const HODL_ERG_TOKEN_ID = (isMainnet: boolean): string => isMainnet ? process.env.NEXT_PUBLIC_MAINNET_HODL_ERG! : process.env.NEXT_PUBLIC_TESTNET_HODL_ERG!;
export const BANK_SINGLETON_TOKEN_ID = (isMainnet: boolean): string => isMainnet ? process.env.NEXT_PUBLIC_MAINNET_BANK_SINGLETON! : process.env.NEXT_PUBLIC_TESTNET_BANK_SINGLETON!;
export const MIN_TX_OPERATOR_FEE = process.env.NEXT_PUBLIC_MIN_TX_OPERATOR_FEE!;
export const MIN_MINER_FEE = BigInt(process.env.NEXT_PUBLIC_MIN_MINER_FEE!);

export const UIMultiplier: bigint = BigInt(1e9);
export const precisionBigInt: bigint = BigInt(1000000);
export const precision: number = 1000000;

export const explorerClient = (isMainnet: boolean) => {
    const explorerConf = new Configuration({
        basePath: EXPLORER_API_URL(isMainnet),
    });
    return DefaultApiFactory(explorerConf);
}