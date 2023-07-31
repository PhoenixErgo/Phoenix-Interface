import { ErgoAddress, Network, SParse } from '@fleet-sdk/core';
import { decodeHexString } from '../serializer';
import {
  COLLECTION_TOKEN_CONSTANT,
  LILIUM_FEE_VALUE_CONSTANT,
  MIN_BOX_VALUE_CONSTANT,
  MINER_FEE_CONSTANT,
  PAYMENT_TOKEN_AMOUNT,
  PRICE_OF_NFT_NANOERG_CONSTANT,
  TX_OPERATOR_FEE_CONSTANT,
} from '../api';
import { OutputInfo } from '../explorerApi';
import { bytesToHex } from '@noble/hashes/utils';

export class StateContract{
  private readonly ergotree: Uint8Array;
  private readonly ergotreeString: string;
  private readonly network: Network;
  private readonly ergoTreeConstants: string;

  constructor(ergotree: string, ergoTreeConstants: string, network: Network) {
    this.ergotreeString = ergotree;
    this.ergotree = decodeHexString(ergotree);
    this.network = network;
    this.ergoTreeConstants = ergoTreeConstants;
  }

  getErgoTree(): Uint8Array {
    return this.ergotree;
  }

  getErgoTreeString(): string {
    return this.ergotreeString;
  }

  getAddress(): ErgoAddress {
    return new ErgoAddress(this.ergotree, this.network)
  }

  private getConstant(constant: number): string | undefined {
    const getRegex = (index: any) => new RegExp(`${index}: (.*?)(?=\\n|$)`);
    const match = getRegex(constant).exec(this.ergoTreeConstants);
    if (match) {
      return match[1];
    }
    return undefined;
  }

  getArtistAddress(){
    throw new Error("Method not implemented.");
    // const address = this.getConstant(ARIST_ADDRESS_CONSTANT);
    // console.log(address as typeof SSigmaProp)
    // if(address){
    //   return new ErgoAddress(decodeHexString(address), this.network);
    // }
    // throw new Error('Lilium fee address not found');
  }

  getMinerFee(): bigint {
    const fee = this.getConstant(MINER_FEE_CONSTANT);
    if (!fee) {
      throw new Error('Miner fee not found');
    }
    return BigInt(fee);
  }

  getCollectionTokenId(): string {
    const collByteArr: string | undefined = this.getConstant(COLLECTION_TOKEN_CONSTANT);

    if (!collByteArr) {
      throw new Error('Collection token id not found');
    }

    const str = collByteArr.replace("Coll(", "").replace(")", "")
    const byteArr = new Uint8Array(str.split(",").map(x => parseInt(x) & 0xFF));

    return bytesToHex(byteArr);
  }

  getLiliumFeeAddress(): ErgoAddress {
    throw new Error("Method not implemented.");
    // const address = this.getConstant(LILIUM_FEE_ADDRESS_CONSTANT);
    // if(address){
    //   return new ErgoAddress(decodeHexString(address), this.network);
    // }
    // throw new Error('Lilium fee address not found');
  }

  getLiliumFeeValue(): bigint {
    const fee = this.getConstant(LILIUM_FEE_VALUE_CONSTANT);
    if (!fee) {
      throw new Error('Lilium fee value not found');
    }
    return BigInt(fee);
  }

  getPriceOfNFTNanoERG(): bigint {
    const price = this.getConstant(PRICE_OF_NFT_NANOERG_CONSTANT);
    if (!price) {
      throw new Error('Price of NFT in nanoERG not found');
    }
    return BigInt(price);
  }

  getPaymentTokenAmount(): bigint {
    const paymentTokenAmount = this.getConstant(PAYMENT_TOKEN_AMOUNT);
    if (!paymentTokenAmount) {
      throw new Error('Payment token amount not found');
    }
    return BigInt(paymentTokenAmount);
  }

  getTxOperatorFee(): number {
    const txOperatorFee = this.getConstant(TX_OPERATOR_FEE_CONSTANT);
    if (!txOperatorFee) {
      throw new Error('Tx operator fee not found');
    }
    return parseInt(txOperatorFee);
  }

  getMinBoxValueConstant(): number {
    const minBoxValue = this.getConstant(MIN_BOX_VALUE_CONSTANT);
    if (!minBoxValue) {
      throw new Error('Min box value not found');
    }
    return parseInt(minBoxValue);
  }

  getIndex(box: OutputInfo): number {
    const r6 = box.additionalRegisters.R6;
    if(!r6){
      throw new Error("R6 not found")
    }
    return parseInt(r6.renderedValue);
  }

  getTimeStamps(box: OutputInfo): number[] {
    const r7 = box.additionalRegisters.R7;
    if(!r7){
      throw new Error("R7 not found")
    }
    return JSON.parse(r7.renderedValue);
  }

  getBooleans(box: OutputInfo): boolean[] {
    const r8 = box.additionalRegisters.R8;
    if(!r8){
      throw new Error("R8 not found")
    }
    return SParse(r8.serializedValue);
  }

  getTokenIds(box: OutputInfo): string[] {
    const r9 = box.additionalRegisters.R9;
    if(!r9){
      throw new Error("R9 not found")
    }
    const tokenArr: Uint8Array[] = SParse(r9.serializedValue);

    return tokenArr.map(bytesToHex);
  }

}