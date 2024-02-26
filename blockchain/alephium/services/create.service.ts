import {
  ALPH_TOKEN_ID,
  ExecuteScriptResult,
  ONE_ALPH,
  SignerProvider,
  stringToHex,
  Token
} from '@alephium/web3';
import { CreateContract, PhoenixMint } from '@/blockchain/alephium/artifacts/ts';
import { getFactoryConfig } from '@/blockchain/alephium/services/utils';

export const create = async (
  signerProvider: SignerProvider,
  network: string | null,
  fee: bigint,
  baseTokenId: string,
  decimals: number,
  symbol: string,
  name: string,
  totalSupply: bigint,
  bankFeeNum: number,
  creatorFeeNum: number,
  interfaceFee: bigint
): Promise<ExecuteScriptResult> => {
  return await CreateContract.execute(signerProvider, {
    initialFields: {
      factory: getFactoryConfig(network).contractId,
      baseTokenId: baseTokenId,
      symbol: stringToHex(symbol),
      name: stringToHex(name),
      totalSupply: totalSupply,
      bankFeeNum: BigInt(bankFeeNum),
      creatorFeeNum: BigInt(creatorFeeNum),
      interfaceFee: interfaceFee
    },
    attoAlphAmount:
      baseTokenId === ALPH_TOKEN_ID
        ? ONE_ALPH + ONE_ALPH + fee + interfaceFee
        : ONE_ALPH + fee + interfaceFee,
    tokens:
      baseTokenId === ALPH_TOKEN_ID
        ? []
        : [{ id: baseTokenId, amount: BigInt(10) ** BigInt(decimals) }]
  });
};
