/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  ExecutableScript,
  ExecuteScriptParams,
  ExecuteScriptResult,
  Script,
  SignerProvider,
  HexString,
} from "@alephium/web3";
import { default as ChangeActiveScriptJson } from "../ChangeActive.ral.json";
import { default as ChangeBankScriptJson } from "../ChangeBank.ral.json";
import { default as ChangeFeeScriptJson } from "../ChangeFee.ral.json";
import { default as ChangeMaxBankFeeNumScriptJson } from "../ChangeMaxBankFeeNum.ral.json";
import { default as ChangeMaxCreatorFeeNumScriptJson } from "../ChangeMaxCreatorFeeNum.ral.json";
import { default as ChangeMaxDecimalsScriptJson } from "../ChangeMaxDecimals.ral.json";
import { default as ChangeOwnerScriptJson } from "../ChangeOwner.ral.json";
import { default as CreateContractScriptJson } from "../CreateContract.ral.json";
import { default as PhoenixBurnScriptJson } from "../PhoenixBurn.ral.json";
import { default as PhoenixDepositScriptJson } from "../PhoenixDeposit.ral.json";
import { default as PhoenixMintScriptJson } from "../PhoenixMint.ral.json";
import { default as WithdrawScriptJson } from "../Withdraw.ral.json";

export const ChangeActive = new ExecutableScript<{
  factory: HexString;
  isActive: boolean;
}>(Script.fromJson(ChangeActiveScriptJson));
export const ChangeBank = new ExecutableScript<{
  factory: HexString;
  newTemplateId: HexString;
}>(Script.fromJson(ChangeBankScriptJson));
export const ChangeFee = new ExecutableScript<{
  factory: HexString;
  newFee: bigint;
}>(Script.fromJson(ChangeFeeScriptJson));
export const ChangeMaxBankFeeNum = new ExecutableScript<{
  factory: HexString;
  newMaxBankFeeNum: bigint;
}>(Script.fromJson(ChangeMaxBankFeeNumScriptJson));
export const ChangeMaxCreatorFeeNum = new ExecutableScript<{
  factory: HexString;
  newMaxCreatorFeeNum: bigint;
}>(Script.fromJson(ChangeMaxCreatorFeeNumScriptJson));
export const ChangeMaxDecimals = new ExecutableScript<{
  factory: HexString;
  newMaxDecimals: bigint;
}>(Script.fromJson(ChangeMaxDecimalsScriptJson));
export const ChangeOwner = new ExecutableScript<{
  factory: HexString;
  newOwner: Address;
}>(Script.fromJson(ChangeOwnerScriptJson));
export const CreateContract = new ExecutableScript<{
  factory: HexString;
  baseTokenId: HexString;
  symbol: HexString;
  name: HexString;
  totalSupply: bigint;
  bankFeeNum: bigint;
  creatorFeeNum: bigint;
  interfaceFee: bigint;
}>(Script.fromJson(CreateContractScriptJson));
export const PhoenixBurn = new ExecutableScript<{
  bank: HexString;
  amountHodlTokenToBurn: bigint;
  interfaceFee: bigint;
}>(Script.fromJson(PhoenixBurnScriptJson));
export const PhoenixDeposit = new ExecutableScript<{
  bank: HexString;
  baseTokenId: HexString;
  amountBaseTokenToDeposit: bigint;
  interfaceFee: bigint;
}>(Script.fromJson(PhoenixDepositScriptJson));
export const PhoenixMint = new ExecutableScript<{
  bank: HexString;
  baseTokenId: HexString;
  amountHodlTokenDesired: bigint;
  baseTokenApprovalAmount: bigint;
  interfaceFee: bigint;
}>(Script.fromJson(PhoenixMintScriptJson));
export const Withdraw = new ExecutableScript<{
  token: HexString;
  amount: bigint;
}>(Script.fromJson(WithdrawScriptJson));
