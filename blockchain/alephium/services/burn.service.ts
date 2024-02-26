import { DUST_AMOUNT, ExecuteScriptResult, SignerProvider } from '@alephium/web3';
import { PhoenixBurn } from '@/blockchain/alephium/artifacts/ts';

export const burn = async (
  signerProvider: SignerProvider,
  bankContractId: string,
  amountHodlTokenToBurn: bigint,
  interfaceFee: bigint
): Promise<ExecuteScriptResult> => {
  return await PhoenixBurn.execute(signerProvider, {
    initialFields: {
      bank: bankContractId,
      amountHodlTokenToBurn,
      interfaceFee
    },
    attoAlphAmount: DUST_AMOUNT + DUST_AMOUNT + DUST_AMOUNT + DUST_AMOUNT + interfaceFee,
    tokens: [
      {
        id: bankContractId,
        amount: amountHodlTokenToBurn
      }
    ]
  });
};
