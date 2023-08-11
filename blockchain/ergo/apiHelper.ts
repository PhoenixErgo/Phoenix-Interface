import {OutputInfo, RegisterType, TransactionInfo} from "./explorerApi";
import {ErgoTransaction, ErgoTransactionOutput, Registers} from "@/types/nodeApi";
import {explorerClient, NODE_API_URL} from "./constants";
import {NodeApi} from "./nodeApi/api";


export async function getUnConfirmedOrConfirmedTx(
    txId: string,
    isMainnet: boolean,
): Promise<TransactionInfo | ErgoTransaction> {
    const nodeApi = new NodeApi(NODE_API_URL(isMainnet));
    try {
        return await nodeApi.transactionsUnconfirmedByTransactionId(txId);
    } catch (error) {
        try {
            return (await explorerClient(isMainnet).getApiV1TransactionsP1(txId)).data;
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