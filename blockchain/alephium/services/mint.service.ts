import {ALPH_TOKEN_ID, DUST_AMOUNT, ExecuteScriptResult, SignerProvider} from '@alephium/web3'
import {PhoenixMint} from "@/blockchain/alephium/artifacts/ts";

export const mint = async (signerProvider: SignerProvider, bankContractId: string, amountHodlTokenDesired: bigint, baseTokenId: string, baseTokenApprovalAmount: bigint, interfaceFee: bigint): Promise<ExecuteScriptResult> => {
    return await PhoenixMint.execute(signerProvider, {
        initialFields: {
            bank: bankContractId,
            baseTokenId,
            baseTokenApprovalAmount,
            amountHodlTokenDesired,
            interfaceFee
        },
        attoAlphAmount: baseTokenId === ALPH_TOKEN_ID ? baseTokenApprovalAmount + interfaceFee : DUST_AMOUNT + interfaceFee,
        tokens: baseTokenId === ALPH_TOKEN_ID ? [] : [{id: baseTokenId, amount: baseTokenApprovalAmount}],
    })
}