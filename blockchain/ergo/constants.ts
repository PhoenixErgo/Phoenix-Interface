import {Configuration, DefaultApiFactory} from "./explorerApi";
import {ErgoAddress, Network} from "@fleet-sdk/core";


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

export const apiPrecisionBigInt: bigint = BigInt(1e9);
export const apiPrecision: number = 1e9;

export const explorerClient = (isMainnet: boolean) => {
    const explorerConf = new Configuration({
        basePath: EXPLORER_API_URL(isMainnet),
    });
    return DefaultApiFactory(explorerConf);
}
export const NEXT_PUBLIC_NEST_API_URL = (isMainnet: boolean) =>  (
    isMainnet
        ? process.env.NEXT_PUBLIC_NEST_MAINNET_API
        : process.env.NEXT_PUBLIC_NEST_TESTNET_API
)!?.replace(/[\\/]+$/, '');

export const BASE_TOKEN_ID = (isMainnet: boolean) => isMainnet ? "6dc054380f0104681b792e5bc23e3dddf82d7dc671aaf6ca05a76992e1a47f91" : "f2c1dc7078baabb8a3f10db11e2959edb390821bfc6f065fa518fea04fe0203f"