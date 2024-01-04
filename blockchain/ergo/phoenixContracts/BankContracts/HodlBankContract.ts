import { OutputInfo } from "@/blockchain/ergo/explorerApi";


interface BurnAmount {
    expectedAmountWithdrawn: bigint;
    devFeeAmount: bigint;
    bankFeeAmount: bigint;
}

export class HodlBankContract {
    protected readonly contractBox: OutputInfo;

    constructor(box: OutputInfo) {
        this.contractBox = box;
    }

    public getTotalTokenSupply(): bigint {
        const r4 = this.contractBox.additionalRegisters.R4;
        if (!r4) {
            throw new Error("R4 not found");
        }
        return BigInt(r4.renderedValue);
    }

    public getPrecisionFactor(): bigint {
        const r5 = this.contractBox.additionalRegisters.R5;
        if (!r5) {
            throw new Error("R5 not found");
        }
        return BigInt(r5.renderedValue);
    }

    public getMinBankValue(): bigint {
        const r6 = this.contractBox.additionalRegisters.R6;
        if (!r6) {
            throw new Error("R6 not found");
        }
        return BigInt(r6.renderedValue);
    }

    public getDevFeeNum(): bigint {
        const r7 = this.contractBox.additionalRegisters.R7;
        if (!r7) {
            throw new Error("R7 not found");
        }
        return BigInt(r7.renderedValue);
    }

    public getBankFeeNum(): bigint {
        const r8 = this.contractBox.additionalRegisters.R8;
        if (!r8) {
            throw new Error("R8 not found");
        }
        return BigInt(r8.renderedValue);
    }

    public getTVL(): bigint {
        return BigInt(this.contractBox.value);
    }

    public getHodlReserveAmount(): bigint {
        return BigInt(this.contractBox.assets![1].amount);
    }

    public getBoxBlockHeight(): number {
        return this.contractBox.settlementHeight;
    }

    public getHodlEmissionAmount(): bigint {
        return this.getTotalTokenSupply() - this.getHodlReserveAmount();
    }

    public getProtocolFeesCollected(): bigint {
        return this.getTVL() -  this.getHodlEmissionAmount();
    }

    public getHodlPrice(): bigint {
        const reserveIn = BigInt(this.contractBox.value);
        const totalTokenSupply = this.getTotalTokenSupply();
        const hodlCoinsIn = BigInt(this.contractBox.assets![1].amount);
        const hodlCoinsCircIn = totalTokenSupply - hodlCoinsIn;
        const precisionFactor = this.getPrecisionFactor();

        return (reserveIn * precisionFactor) / hodlCoinsCircIn;
    }

    public mintAmount(hodlMintAmt: bigint): bigint {
        const price = this.getHodlPrice();
        const precisionFactor = this.getPrecisionFactor();

        return (hodlMintAmt * price) / precisionFactor;
    }

    public burnAmount(hodlBurnAmt: bigint): BurnAmount {
        const feeDenom = BigInt(1000);

        const devFee = this.getDevFeeNum();
        const bankFee = this.getBankFeeNum();

        const price = this.getHodlPrice();
        const precisionFactor = this.getPrecisionFactor();

        const beforeFees = (hodlBurnAmt * price) / precisionFactor;
        const bankFeeAmount = (beforeFees * bankFee) / feeDenom;

        const devFeeAmount = (beforeFees * devFee) / feeDenom;

        const expectedAmountWithdrawn = beforeFees - bankFeeAmount - devFeeAmount;

        return {
            expectedAmountWithdrawn, // amount of ERG returned to user
            devFeeAmount,
            bankFeeAmount,
        };
    }
}
