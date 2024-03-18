/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  Contract,
  ContractState,
  TestContractResult,
  HexString,
  ContractFactory,
  EventSubscribeOptions,
  EventSubscription,
  CallContractParams,
  CallContractResult,
  TestContractParams,
  ContractEvent,
  subscribeContractEvent,
  subscribeContractEvents,
  testMethod,
  callMethod,
  multicallMethods,
  fetchContractState,
  ContractInstance,
  getContractEventsCurrentCount,
} from "@alephium/web3";
import { default as PhoenixFactoryContractJson } from "../PhoenixFactory.ral.json";
import { getContractByCodeHash } from "./contracts";

// Custom types for the contract
export namespace PhoenixFactoryTypes {
  export type Fields = {
    phoenixBankTemplateId: HexString;
    selfOwner: Address;
    fee: bigint;
    active: boolean;
    maxDecimals: bigint;
    maxBankFeeNum: bigint;
    maxCreatorFeeNum: bigint;
    minValueDivisor: bigint;
    contractCreationALPH: bigint;
  };

  export type State = ContractState<Fields>;

  export type CreationEvent = ContractEvent<{
    creator: Address;
    contractId: HexString;
    baseTokenId: HexString;
    bankFeeNum: bigint;
  }>;

  export interface CallMethodTable {
    getPhoenixBankTemplateId: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<HexString>;
    };
    getFee: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getActive: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<boolean>;
    };
    getMaxDecimals: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getMaxBankFeeNum: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getMaxCreatorFeeNum: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getMinValueDivisor: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getContractCreationALPH: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
  }
  export type CallMethodParams<T extends keyof CallMethodTable> =
    CallMethodTable[T]["params"];
  export type CallMethodResult<T extends keyof CallMethodTable> =
    CallMethodTable[T]["result"];
  export type MultiCallParams = Partial<{
    [Name in keyof CallMethodTable]: CallMethodTable[Name]["params"];
  }>;
  export type MultiCallResults<T extends MultiCallParams> = {
    [MaybeName in keyof T]: MaybeName extends keyof CallMethodTable
      ? CallMethodTable[MaybeName]["result"]
      : undefined;
  };
}

class Factory extends ContractFactory<
  PhoenixFactoryInstance,
  PhoenixFactoryTypes.Fields
> {
  getInitialFieldsWithDefaultValues() {
    return this.contract.getInitialFieldsWithDefaultValues() as PhoenixFactoryTypes.Fields;
  }

  eventIndex = { Creation: 0 };
  consts = {
    ErrorCodes: {
      NotActive: BigInt(0),
      MaxDecimalsExceeded: BigInt(1),
      MaxBankFeeNumExceeded: BigInt(2),
      MaxCreatorFeeNumExceeded: BigInt(3),
      MinNotMet: BigInt(4),
    },
    OwnedError: { Forbidden: BigInt(90) },
  };

  at(address: string): PhoenixFactoryInstance {
    return new PhoenixFactoryInstance(address);
  }

  tests = {
    assertOwner: async (
      params: TestContractParams<
        PhoenixFactoryTypes.Fields,
        { caller: Address }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "assertOwner", params);
    },
    setOwner: async (
      params: TestContractParams<
        PhoenixFactoryTypes.Fields,
        { newOwner: Address }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "setOwner", params);
    },
    setPhoenixBankTemplateId: async (
      params: TestContractParams<
        PhoenixFactoryTypes.Fields,
        { newTemplateId: HexString }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "setPhoenixBankTemplateId", params);
    },
    getPhoenixBankTemplateId: async (
      params: Omit<
        TestContractParams<PhoenixFactoryTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<HexString>> => {
      return testMethod(this, "getPhoenixBankTemplateId", params);
    },
    setFee: async (
      params: TestContractParams<PhoenixFactoryTypes.Fields, { newFee: bigint }>
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "setFee", params);
    },
    getFee: async (
      params: Omit<
        TestContractParams<PhoenixFactoryTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getFee", params);
    },
    setActive: async (
      params: TestContractParams<
        PhoenixFactoryTypes.Fields,
        { isActive: boolean }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "setActive", params);
    },
    getActive: async (
      params: Omit<
        TestContractParams<PhoenixFactoryTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<boolean>> => {
      return testMethod(this, "getActive", params);
    },
    setMaxDecimals: async (
      params: TestContractParams<
        PhoenixFactoryTypes.Fields,
        { newMaxDecimals: bigint }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "setMaxDecimals", params);
    },
    getMaxDecimals: async (
      params: Omit<
        TestContractParams<PhoenixFactoryTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getMaxDecimals", params);
    },
    setMaxBankFeeNum: async (
      params: TestContractParams<
        PhoenixFactoryTypes.Fields,
        { newMaxBankFeeNum: bigint }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "setMaxBankFeeNum", params);
    },
    getMaxBankFeeNum: async (
      params: Omit<
        TestContractParams<PhoenixFactoryTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getMaxBankFeeNum", params);
    },
    setMaxCreatorFeeNum: async (
      params: TestContractParams<
        PhoenixFactoryTypes.Fields,
        { newMaxCreatorFeeNum: bigint }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "setMaxCreatorFeeNum", params);
    },
    getMaxCreatorFeeNum: async (
      params: Omit<
        TestContractParams<PhoenixFactoryTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getMaxCreatorFeeNum", params);
    },
    setMinValueDivisor: async (
      params: TestContractParams<
        PhoenixFactoryTypes.Fields,
        { newMinValueDivisor: bigint }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "setMinValueDivisor", params);
    },
    getMinValueDivisor: async (
      params: Omit<
        TestContractParams<PhoenixFactoryTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getMinValueDivisor", params);
    },
    setContractCreationALPH: async (
      params: TestContractParams<
        PhoenixFactoryTypes.Fields,
        { newContractCreationALPH: bigint }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "setContractCreationALPH", params);
    },
    getContractCreationALPH: async (
      params: Omit<
        TestContractParams<PhoenixFactoryTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getContractCreationALPH", params);
    },
    createContract: async (
      params: TestContractParams<
        PhoenixFactoryTypes.Fields,
        {
          baseTokenId: HexString;
          symbol: HexString;
          name: HexString;
          totalSupply: bigint;
          bankFeeNum: bigint;
          creatorFeeNum: bigint;
        }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "createContract", params);
    },
  };
}

// Use this object to test and deploy the contract
export const PhoenixFactory = new Factory(
  Contract.fromJson(
    PhoenixFactoryContractJson,
    "",
    "8fa6b2a3bf1df36322e9ddf927e457ad521339a2b87af3b8c7f9d76b7ec197d5"
  )
);

// Use this class to interact with the blockchain
export class PhoenixFactoryInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<PhoenixFactoryTypes.State> {
    return fetchContractState(PhoenixFactory, this);
  }

  async getContractEventsCurrentCount(): Promise<number> {
    return getContractEventsCurrentCount(this.address);
  }

  subscribeCreationEvent(
    options: EventSubscribeOptions<PhoenixFactoryTypes.CreationEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      PhoenixFactory.contract,
      this,
      options,
      "Creation",
      fromCount
    );
  }

  methods = {
    getPhoenixBankTemplateId: async (
      params?: PhoenixFactoryTypes.CallMethodParams<"getPhoenixBankTemplateId">
    ): Promise<
      PhoenixFactoryTypes.CallMethodResult<"getPhoenixBankTemplateId">
    > => {
      return callMethod(
        PhoenixFactory,
        this,
        "getPhoenixBankTemplateId",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getFee: async (
      params?: PhoenixFactoryTypes.CallMethodParams<"getFee">
    ): Promise<PhoenixFactoryTypes.CallMethodResult<"getFee">> => {
      return callMethod(
        PhoenixFactory,
        this,
        "getFee",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getActive: async (
      params?: PhoenixFactoryTypes.CallMethodParams<"getActive">
    ): Promise<PhoenixFactoryTypes.CallMethodResult<"getActive">> => {
      return callMethod(
        PhoenixFactory,
        this,
        "getActive",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getMaxDecimals: async (
      params?: PhoenixFactoryTypes.CallMethodParams<"getMaxDecimals">
    ): Promise<PhoenixFactoryTypes.CallMethodResult<"getMaxDecimals">> => {
      return callMethod(
        PhoenixFactory,
        this,
        "getMaxDecimals",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getMaxBankFeeNum: async (
      params?: PhoenixFactoryTypes.CallMethodParams<"getMaxBankFeeNum">
    ): Promise<PhoenixFactoryTypes.CallMethodResult<"getMaxBankFeeNum">> => {
      return callMethod(
        PhoenixFactory,
        this,
        "getMaxBankFeeNum",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getMaxCreatorFeeNum: async (
      params?: PhoenixFactoryTypes.CallMethodParams<"getMaxCreatorFeeNum">
    ): Promise<PhoenixFactoryTypes.CallMethodResult<"getMaxCreatorFeeNum">> => {
      return callMethod(
        PhoenixFactory,
        this,
        "getMaxCreatorFeeNum",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getMinValueDivisor: async (
      params?: PhoenixFactoryTypes.CallMethodParams<"getMinValueDivisor">
    ): Promise<PhoenixFactoryTypes.CallMethodResult<"getMinValueDivisor">> => {
      return callMethod(
        PhoenixFactory,
        this,
        "getMinValueDivisor",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getContractCreationALPH: async (
      params?: PhoenixFactoryTypes.CallMethodParams<"getContractCreationALPH">
    ): Promise<
      PhoenixFactoryTypes.CallMethodResult<"getContractCreationALPH">
    > => {
      return callMethod(
        PhoenixFactory,
        this,
        "getContractCreationALPH",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
  };

  async multicall<Calls extends PhoenixFactoryTypes.MultiCallParams>(
    calls: Calls
  ): Promise<PhoenixFactoryTypes.MultiCallResults<Calls>> {
    return (await multicallMethods(
      PhoenixFactory,
      this,
      calls,
      getContractByCodeHash
    )) as PhoenixFactoryTypes.MultiCallResults<Calls>;
  }
}
