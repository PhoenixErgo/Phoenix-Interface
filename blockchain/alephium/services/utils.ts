import {NetworkId} from "@alephium/web3";
import {loadDeployments} from "@/blockchain/alephium/artifacts/ts/deployments";

export interface BankConfig {
    network: NetworkId
    groupIndex: number
    bankAddress: string
    contractId: string
}

export interface FactoryConfig {
    network: NetworkId
    groupIndex: number
    factoryAddress: string
    contractId: string
}

function getNetwork(): NetworkId {
    return (process.env.NEXT_PUBLIC_NETWORK ?? 'devnet') as NetworkId
}

export function getPhoenixConfig(network: string | null): BankConfig {
    let net: "mainnet" | "testnet" | "devnet";
    switch (network){
        case '4':
            net = 'mainnet';
            break;
        case '5':
            net = 'testnet';
            break;
        case '6':
            net = 'devnet';
            break;
        default:
            net = 'testnet';
            break;
    }
    const phoenix = loadDeployments(net).contracts.PhoenixBank.contractInstance
    const groupIndex = phoenix.groupIndex
    const bankAddress = phoenix.address
    const contractId = phoenix.contractId
    return { network: net, groupIndex, bankAddress, contractId }
}

export function getFactoryConfig(network: string | null): FactoryConfig {
    let net: "mainnet" | "testnet" | "devnet";
    switch (network){
        case '4':
            net = 'mainnet';
            break;
        case '5':
            net = 'testnet';
            break;
        case '6':
            net = 'devnet';
            break;
        default:
            net = 'testnet';
            break;
    }
    const factory = loadDeployments(net).contracts.PhoenixFactory.contractInstance
    const groupIndex = factory.groupIndex
    const factoryAddress = factory.address
    const contractId = factory.contractId
    return { network: net, groupIndex, factoryAddress, contractId }
}