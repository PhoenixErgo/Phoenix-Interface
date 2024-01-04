import { OutputInfo } from "@/blockchain/ergo/explorerApi";
import {HodlBankContract} from "@/blockchain/ergo/phoenixContracts/BankContracts/HodlBankContract";


interface BurnAmount {
    expectedAmountWithdrawn: bigint;
    devFeeAmount: bigint;
    bankFeeAmount: bigint;
}

export class HodlTokenContract extends HodlBankContract{

    constructor(box: OutputInfo) {
        super(box);
    }

    public override getTVL(): bigint {
        return BigInt(this.contractBox.assets![2].amount);
    }

    public override getProtocolFeesCollected(): bigint {
        return this.getTVL() -  this.getHodlEmissionAmount();
    }

    public override getHodlPrice(): bigint {
        const reserveIn = this.getTVL();
        const totalTokenSupply = this.getTotalTokenSupply();
        const hodlCoinsIn = BigInt(this.contractBox.assets![1].amount);
        const hodlCoinsCircIn = totalTokenSupply - hodlCoinsIn;
        const precisionFactor = this.getPrecisionFactor();

        return (reserveIn * precisionFactor) / hodlCoinsCircIn;
    }

    public override mintAmount(hodlMintAmt: bigint): bigint {
        const price = this.getHodlPrice();
        const precisionFactor = this.getPrecisionFactor();

        return (hodlMintAmt * price) / precisionFactor;
    }

    private divUp(dividend: bigint, divisor: bigint): bigint {
        if (divisor === BigInt(0)) {
            return BigInt(-1);
        } else {
            return (dividend + (divisor - BigInt(1))) / divisor;
        }
    }

    public override burnAmount(hodlBurnAmt: bigint): BurnAmount {
        const feeDenom: number = 1000;

        const bankFeeNum = this.getBankFeeNum();
        const devFeeNum = this.getDevFeeNum();

        const price = this.getHodlPrice();
        const precisionFactor = this.getPrecisionFactor();

        const expectedAmountBeforeFees = hodlBurnAmt * price / precisionFactor;

        const dividend_1 = (expectedAmountBeforeFees * (bankFeeNum + devFeeNum));
        const divisor_1 = BigInt(feeDenom);

        const bankFeeAndDevFeeAmount = this.divUp(dividend_1, divisor_1);

        const dividend_2 = (bankFeeAndDevFeeAmount * BigInt(devFeeNum));
        const divisor_2 = (BigInt(bankFeeNum) + BigInt(devFeeNum));

        const devFeeAmount = this.divUp(dividend_2, divisor_2);
        const bankFeeAmount = bankFeeAndDevFeeAmount - devFeeAmount;

        const devFeeAmountAdjusted = bankFeeAmount === BigInt(0) ? BigInt(0) : devFeeAmount;
        const bankFeeAmountAdjusted = bankFeeAmount === BigInt(0) ? devFeeAmount : bankFeeAmount;

        console.log(`devFeeAmountAdjusted ${devFeeAmountAdjusted}`)
        console.log(`bankFeeAmountAdjusted ${bankFeeAmountAdjusted}`)

        const expectedAmountWithdrawn = expectedAmountBeforeFees - bankFeeAmountAdjusted - devFeeAmountAdjusted;

        return {
            expectedAmountWithdrawn,
            devFeeAmount: devFeeAmountAdjusted,
            bankFeeAmount: bankFeeAmountAdjusted,
        }
    }
}
