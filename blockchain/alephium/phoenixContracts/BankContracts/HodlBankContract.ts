import {PhoenixBank, PhoenixBankInstance} from "@/blockchain/alephium/artifacts/ts";
import {NodeProvider, web3} from "@alephium/web3";
import {ALPH_NODE_URL} from "@/blockchain/alephium/constants";


interface BurnAmount {
    expectedAmountWithdrawn: bigint;
    creatorFeeAmount: bigint;
    devFeeAmount: bigint;
    bankFeeAmount: bigint;
}

export class HodlBankContract {
    private readonly bank: PhoenixBankInstance;

    constructor(bankContractAddress: string, network: string | null) {

        const nodeProvider = new NodeProvider(ALPH_NODE_URL(network));
        web3.setCurrentNodeProvider(nodeProvider);

        this.bank = PhoenixBank.at(bankContractAddress);
    }

    async getTotalTokenSupply(): Promise<bigint> {
        const result = await this.bank.methods.getTotalSupply();
        return result.returns;
    }

    async getMinBankValue(): Promise<bigint> {
        const result = await this.bank.methods.getMinBankValue();
        return result.returns;
    }

    async getDevFeeNum(): Promise<bigint> {
        const result = await this.bank.methods.getDevFeeNum();
        return result.returns;
    }

    async getBankFeeNum(): Promise<bigint> {
        const result = await this.bank.methods.getBankFeeNum();
        return result.returns;
    }

    async getCreatorFeeNum(): Promise<bigint> {
        const result = await this.bank.methods.getCreatorFeeNum();
        return result.returns;
    }

    async getTVL(): Promise<bigint> {
        const result = await this.bank.methods.getBaseBalance();
        return result.returns;
    }

    async getHodlALPHReserveAmount(): Promise<bigint> {
        const result = await this.bank.methods.getHodlTokenBalance();
        return result.returns;
    }

    async getHodlALPHEmissionAmount(): Promise<bigint> {
        const result = await this.bank.methods.getCirculatingSupply();
        return result.returns;
    }

    async getProtocolFeesCollected(): Promise<bigint> {
        return await this.getTVL() -  await this.getHodlALPHEmissionAmount();
    }

    async getHodlALPHPrice(): Promise<bigint> {
        const reserveIn = await this.getTVL();
        const totalTokenSupply = await this.getTotalTokenSupply();
        const hodlCoinsIn = await this.getHodlALPHReserveAmount();
        const hodlCoinsCircIn = totalTokenSupply - hodlCoinsIn;

        return reserveIn / hodlCoinsCircIn
    }

    async mintAmount(hodlMintAmt: bigint): Promise<bigint> {
        const priceNumerator = await this.getTVL();
        const priceDenominator = await this.getHodlALPHEmissionAmount()

        return this.divUp((hodlMintAmt * priceNumerator), priceDenominator);
    }

    private divUp(dividend: bigint, divisor: bigint): bigint {
        if (divisor === BigInt(0)) {
            return BigInt(-1);
        } else {
            return (dividend + (divisor - BigInt(1))) / divisor;
        }
    }

    async burnAmount(hodlBurnAmt: bigint): Promise<BurnAmount> {
        const feeDenom = BigInt(1000);

        const devFeeNum = await this.getDevFeeNum();
        const bankFeeNum = await this.getBankFeeNum();
        const creatorFeeNum = await this.getCreatorFeeNum();

        const priceNumerator = await this.getTVL();
        const priceDenominator = await this.getHodlALPHEmissionAmount();

        const expectedAmountBeforeFees = (hodlBurnAmt * priceNumerator) / priceDenominator;

        const totalFees = bankFeeNum + devFeeNum + creatorFeeNum;
        const totalFeeAmount = this.divUp(expectedAmountBeforeFees * totalFees, feeDenom);

        const bankFeeAmount = this.divUp(totalFeeAmount * bankFeeNum, totalFees);

        const remainingFeeAmount = totalFeeAmount - bankFeeAmount;

        const devAndCreatorTotal = devFeeNum + creatorFeeNum
        const devFeeAmount = devAndCreatorTotal > 0 ? this.divUp(remainingFeeAmount * devFeeNum, devAndCreatorTotal) : BigInt(0)
        const creatorFeeAmount = devAndCreatorTotal > 0 ? remainingFeeAmount - devFeeAmount : BigInt(0)

        const expectedAmountWithdrawn = expectedAmountBeforeFees - totalFeeAmount;

        return {
            expectedAmountWithdrawn,
            creatorFeeAmount,
            devFeeAmount,
            bankFeeAmount,
        }
    }
}
