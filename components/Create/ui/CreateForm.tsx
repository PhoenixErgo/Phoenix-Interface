import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
    OutputInfo,
} from "@/blockchain/ergo/explorerApi";
import {
    BANK_SINGLETON_TOKEN_ID,
    explorerClient,
    HODL_ERG_TOKEN_ID,
    MIN_MINER_FEE,
    MIN_TX_OPERATOR_FEE,
    precision,
    precisionBigInt,
    PROXY_ADDRESS,
    UIMultiplier,
} from "@/blockchain/ergo/constants";
import { HodlBankContract } from "@/blockchain/ergo/phoenixContracts/BankContracts/HodlBankContract";
import {
    checkWalletConnection,
    outputInfoToErgoTransactionOutput,
    signAndSubmitTx,
} from "@/blockchain/ergo/walletUtils/utils";
import { toast } from "react-toastify";
import {
    noti_option,
    noti_option_close,
    txSubmmited,
} from "@/components/Notifications/Toast";
import {
    Amount,
    Box,
    ErgoAddress,
    OutputBuilder,
    SConstant,
    SLong,
    TransactionBuilder,
} from "@fleet-sdk/core";
import { hasDecimals, localStorageKeyExists } from "@/common/utils";
import { getInputBoxes, getShortLink, getWalletConfig } from "@/blockchain/ergo/wallet/utils";
import assert from "assert";
import { getTxReducedB64Safe } from "@/blockchain/ergo/ergopay/reducedTxn";
import ErgoPayWalletModal from "@/components/wallet/ErgoPayWalletModal";
import SelectTokenModal from "./SelectTokenModal";
import { take } from "rxjs";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { createFormData } from "../../../types/front";


const CreateForm = () => {
    const [isMainnet, setIsMainnet] = useState<boolean>(true);
    const [burnAmount, setBurnAmount] = useState<number>(0);
    const [bankBox, setBankBox] = useState<OutputInfo | null>(null);
    const [ergPrice, setErgPrice] = useState<number>(0);
    const [proxyAddress, setProxyAddress] = useState<string>("");

    const [isModalErgoPayOpen, setIsModalErgoPayOpen] = useState<boolean>(false);
    const [ergoPayLink, setErgoPayLink] = useState<string>("");
    const [ergoPayTxId, setErgoPayTxId] = useState<string>("");

    const [displaySelectTokenModal, setDisplaySelectTokenModal] = useState<boolean>(false);

    useEffect(() => {
        const isMainnet = localStorage.getItem("IsMainnet")
            ? (JSON.parse(localStorage.getItem("IsMainnet")!) as boolean)
            : true;

        setIsMainnet(isMainnet);
        setProxyAddress(PROXY_ADDRESS(isMainnet));

        explorerClient(isMainnet)
            .getApiV1BoxesUnspentBytokenidP1(BANK_SINGLETON_TOKEN_ID(isMainnet))
            .then((res) => {
                setBankBox(res.data.items![0] as OutputInfo);
            })
            .catch((err) => {
                toast.dismiss();
                toast.warn("error getting bank box", noti_option_close("try-again"));
                setBankBox(null);
            });
    }, []);

    const minBoxValue = BigInt(1000000);

    useEffect(() => {
        if (
            !isNaN(burnAmount) &&
            burnAmount >= 0.001 &&
            !hasDecimals(burnAmount * 1e9) &&
            bankBox
        ) {
            const burnAmountBigInt = BigInt(burnAmount * 1e9);
            const hodlBankContract = new HodlBankContract(bankBox);
            const ep =
                hodlBankContract.burnAmount(burnAmountBigInt).expectedAmountWithdrawn;
            setErgPrice(Number((ep * precisionBigInt) / UIMultiplier) / precision);
        } else {
            toast.dismiss();
            toast.warn("error calculating price", noti_option_close("try-again"));
            setErgPrice(0);
        }
    }, [burnAmount]);


    const initialFormData: createFormData = {
        token: '',
        bankFee: 0,
        creatorFee: 0,
        uiPromotionFee: 0,
        setupFee: 0,
    };
    const [createFormData, setCreateFormData] = useState<createFormData>(initialFormData);


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setCreateFormData({
            ...createFormData,
            [name]: name === 'token' ? value : parseFloat(value),
        });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log(
            "Create Form Data: ", createFormData
        )

        // Clear fields
        setCreateFormData(initialFormData);
    };

    return (
        <>
            <div className="max-w-md mx-auto font-inter">
                <h2 className="text-black font-bold text-3xl mb-5 lg:mb-8">Create Form</h2>
                <p className="text-black my-3 min-h-[100px]">
                    When creating..., there is a protocol fee and a dev
                    fee associated with the process. The protocol fee contributes to the
                    overall dynamics of the ecosystem.
                </p>

                <form
                    className="flex flex-col bg-gray-200 shadow-lg justify-between rounded-md items-start h-full"
                    onSubmit={handleSubmit}>

                    <div className="mb-2 mt-2 flex flex-row justify-between items-center w-full h-full">
                        <label className="pl-5 font-bold">
                            Token
                        </label>
                        {initialFormData.token === "" ?
                            <div
                                onClick={() => setDisplaySelectTokenModal(!displaySelectTokenModal)}
                                className="focus:outline-none text-white primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300 font-medium rounded text-md px-12 py-3 mr-4 cursor-pointer flex"><span> Select a token</span> <svg width="24px" height="24px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="#FFF" d="M13.098 8H6.902c-.751 0-1.172.754-.708 1.268L9.292 12.7c.36.399 1.055.399 1.416 0l3.098-3.433C14.27 8.754 13.849 8 13.098 8Z" /></svg></div>
                            :
                            <div className="">{initialFormData.token}</div>
                        }
                    </div>

                    {/* Bank Fee */}
                    <div className="mb-2 mt-2 flex flex-row justify-between items-center w-full h-full">
                        <label className="pl-5 font-bold">
                            Bank Fee %
                        </label>
                        <input
                            placeholder="Bank Fee"
                            type="number"
                            name="bankFee"
                            value={createFormData.bankFee}
                            onChange={handleChange}
                            className="w-25 border-b-2 border-l-0 border-r-0 border-t-0 border-gray-300 bg-transparent text-gray-500 font-medium text-md h-14 focus:outline-none focus:ring-0 focus:border-primary focus-within:outline-none focus-within:shadow-none focus:shadow-none mr-4 ml-4 text-center"
                        />
                    </div>

                    {/* Creator Fee */}
                    <div className="mb-2 mt-2 flex flex-row justify-between items-center w-full h-full">
                        <label className="pl-5 font-bold">
                            Creator Fee %
                        </label>
                        <input
                            placeholder="Creator Fee"
                            type="number"
                            name="creatorFee"
                            value={createFormData.creatorFee}
                            onChange={handleChange}
                            className="w-25 border-b-2 border-l-0 border-r-0 border-t-0 border-gray-300 bg-transparent text-gray-500 font-medium text-md h-14 focus:outline-none focus:ring-0 focus:border-primary focus-within:outline-none focus-within:shadow-none focus:shadow-none mr-4 ml-4 text-center"
                        />
                    </div>

                    {/* UI Promotion Fee */}
                    <div className="mb-2 mt-2 flex flex-row justify-between items-center w-full h-full">
                        <label className="pl-5 font-bold">
                            UI Promotion Fee %
                        </label>
                        <input
                            placeholder="UI Promotion Fee"
                            type="number"
                            name="uiPromotionFee"
                            value={createFormData.uiPromotionFee}
                            onChange={handleChange}
                            className="w-25 border-b-2 border-l-0 border-r-0 border-t-0 border-gray-300 bg-transparent text-gray-500 font-medium text-md h-14 focus:outline-none focus:ring-0 focus:border-primary focus-within:outline-none focus-within:shadow-none focus:shadow-none mr-4 ml-4 text-center"
                        />
                    </div>

                    {/* Setup Fee */}
                    <div className="mb-2 mt-2 flex flex-row justify-between items-center w-full h-full">
                        <label className="pl-5 font-bold">
                            Setup Fee %
                        </label>
                        <input
                            placeholder="Setup Fee"
                            type="number"
                            name="setupFee"
                            value={createFormData.setupFee}
                            onChange={handleChange}
                            className="w-25 border-b-2 border-l-0 border-r-0 border-t-0 border-gray-300 bg-transparent text-gray-500 font-medium text-md h-14 focus:outline-none focus:ring-0 focus:border-primary focus-within:outline-none focus-within:shadow-none focus:shadow-none mr-4 ml-4 text-center"
                        />
                    </div>

                    {initialFormData.token === ""}
                    <button disabled={initialFormData.token === ""} type="submit" className="w-full focus:outline-none text-white primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300 font-medium rounded text-md  px-4 py-3">Create</button>

                    {isModalErgoPayOpen && (
                        <ErgoPayWalletModal
                            isModalOpen={isModalErgoPayOpen}
                            setIsModalOpen={setIsModalErgoPayOpen}
                            ergoPayLink={ergoPayLink}
                            txid={ergoPayTxId}
                            isMainnet={isMainnet}
                        ></ErgoPayWalletModal>
                    )}
                </form>
            </div>
            <SelectTokenModal
                createFormData={createFormData}
                setCreateFormData={setCreateFormData}
                displaySelectTokenModal={displaySelectTokenModal}
                setDisplaySelectTokenModal={setDisplaySelectTokenModal} />
        </>
    );
};
export default CreateForm;
