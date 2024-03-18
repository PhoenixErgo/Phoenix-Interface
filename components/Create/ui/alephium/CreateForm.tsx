import React, { ChangeEvent, FormEvent, useState } from 'react';
import SelectTokenModal from '../SelectTokenModal';
import { createFormData } from '@/types/front';
import { create } from '@/blockchain/alephium/services/create.service';
import { useWallet } from '@alephium/web3-react';
import { toast } from 'react-toastify';
import { ALPHTxSubmitted, noti_option, noti_option_close } from '@/components/Notifications/Toast';
import { hasDecimals } from '@/common/utils';
import { PhoenixFactory } from '@/blockchain/alephium/artifacts/ts';
import { getFactoryConfig } from '@/blockchain/alephium/services/utils';
import { CREATE_UI_FEE } from '@/blockchain/alephium/constants';
import Image from 'next/image';

function validateInputs(inputs: createFormData): boolean {
  if (inputs.tokenId === '') {
    console.log('tokenId is empty');
    toast.dismiss();
    toast.warn('select token', noti_option_close('try-again'));
    return false;
  }

  if (!(inputs.symbol.length >= 3 && /^[A-Z0-9]+$/.test(inputs.symbol))) {
    console.log('symbol invalid');
    toast.dismiss();
    toast.warn('ticker must have at least 3 capital letters', noti_option_close('try-again'));
    return false;
  }

  if (inputs.name.length <= 0) {
    console.log('name invalid');
    toast.dismiss();
    toast.warn('enter name', noti_option_close('try-again'));
    return false;
  }

  if (hasDecimals(inputs.bankFee, 1)) {
    console.log('bankFee invalid');
    toast.dismiss();
    toast.warn('bank fee can have up to one decimal place', noti_option_close('try-again'));
    return false;
  }

  if (inputs.bankFee < 1) {
    console.log('bankFee invalid');
    toast.dismiss();
    toast.warn('bank fee must be at least 1 percent', noti_option_close('try-again'));
    return false;
  }

  if (hasDecimals(inputs.creatorFee, 1)) {
    console.log('creatorFee invalid');
    toast.dismiss();
    toast.warn('creator fee can have up to one decimal place', noti_option_close('try-again'));
    return false;
  }

  return true;
}

interface IProps {
  network: string | null;
}

const CreateForm = (props: IProps) => {
  const { signer, account } = useWallet();
  const { network } = props;

  const [displaySelectTokenModal, setDisplaySelectTokenModal] = useState<boolean>(false);

  const initialFormData: createFormData = {
    tokenId: '',
    ticker: '',
    symbol: '',
    name: '',
    tokenName: '',
    img: '',
    bankFee: 0,
    creatorFee: 0,
    uiPromotionFee: 0
  };
  const [createFormData, setCreateFormData] = useState<createFormData>(initialFormData);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCreateFormData({
      ...createFormData,
      [name]: ['token', 'symbol', 'name'].some((e) => name == e) ? value : parseFloat(value)
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (signer) {
      const txBuilding_noti = toast.loading('please wait...', noti_option);
      let result;
      try {
        const tokenMetadata = await signer.nodeProvider!.fetchFungibleTokenMetaData(
          createFormData.tokenId
        );
        if (!validateInputs(createFormData)) {
          return;
        }
        toast.update(txBuilding_noti, {
          render: 'Sign your transaction',
          type: 'success',
          isLoading: false,
          autoClose: false
        });
        const bankFee = Math.round(createFormData.bankFee * 10);
        const creatorFee = Math.round(createFormData.creatorFee * 10);
        console.log('bankFee', bankFee);
        console.log('creatorFee', creatorFee);
        const factory = PhoenixFactory.at(getFactoryConfig(network).factoryAddress);
        const fee = (await factory.methods.getFee()).returns;
        // TODO: Display Fee as "Creation Fee" somewhere on UI
        result = await create(
          signer,
          network,
          fee,
          createFormData.tokenId,
          tokenMetadata.decimals,
          createFormData.symbol,
          createFormData.name,
          BigInt(tokenMetadata.totalSupply.toString()),
          bankFee,
          creatorFee,
          BigInt(CREATE_UI_FEE)
        );
      } catch (error) {
        toast.dismiss();
        toast.warn('issue signing tx', noti_option_close('try-again'));
        console.log(error);
        return;
      }
      toast.dismiss();
      ALPHTxSubmitted(result.txId, network);
      console.log(JSON.stringify(result, null, 2));
    } else {
      toast.dismiss();
      toast.warn('please connect wallet', noti_option_close('try-again'));
    }
    // Clear fields
    setCreateFormData(initialFormData);
    return;
  };

  return (
    <>
      <div className="max-w-md mx-auto font-inter">
        <h2 className="text-black font-bold text-3xl mb-5 lg:mb-8">Create Form</h2>
        <p className="text-black my-3 min-h-[100px]">
          Create any Hodl token game! There is a creation fee of 1 ALPH. There is a UI fee of 1
          ALPH. Bank fee is the mechanic which allows for price increase, it must be at least one
          percent and at most 50 percent. Creator fee is what you, the creator, gets each time
          someone burns. This can be set to 0 percent and at most 20 percent. There is a dev fee of
          10% the bank fee.
        </p>

        <form
          className="flex flex-col bg-gray-200 shadow-lg justify-between rounded-md items-start h-full"
          onSubmit={handleSubmit}
        >
          <div className="mb-2 mt-2 flex flex-row justify-between items-center w-full h-full">
            <label className="pl-5 font-bold">Token</label>
            {createFormData?.ticker === '' ? (
              <div
                onClick={() => setDisplaySelectTokenModal(!displaySelectTokenModal)}
                className="focus:outline-none text-white primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300 font-medium rounded text-md px-12 py-3 mr-4 cursor-pointer flex"
              >
                <span> Select a token</span>
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#FFF"
                    d="M13.098 8H6.902c-.751 0-1.172.754-.708 1.268L9.292 12.7c.36.399 1.055.399 1.416 0l3.098-3.433C14.27 8.754 13.849 8 13.098 8Z"
                  />
                </svg>
              </div>
            ) : (
              <div
                onClick={() => setDisplaySelectTokenModal(!displaySelectTokenModal)}
                className="focus:outline-none text-white primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300 font-medium rounded text-md px-12 py-3 mr-4 cursor-pointer flex"
              >
                {/* eslint-disable-next-line */}
                <img className="w-6 h-6 mr-2" src={createFormData.img} alt="Token Img" />

                <div>{createFormData.ticker}</div>
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#FFF"
                    d="M13.098 8H6.902c-.751 0-1.172.754-.708 1.268L9.292 12.7c.36.399 1.055.399 1.416 0l3.098-3.433C14.27 8.754 13.849 8 13.098 8Z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Ticker */}
          <div className="mb-2 mt-2 flex flex-row justify-between items-center w-full h-full">
            <label className="pl-5 font-bold">Ticker</label>
            <input
              placeholder="Ticker"
              type="text"
              name="symbol"
              value={createFormData.symbol}
              onChange={handleChange}
              className="w-25 border-b-2 border-l-0 border-r-0 border-t-0 border-gray-300 bg-transparent text-gray-500 font-medium text-md h-14 focus:outline-none focus:ring-0 focus:border-primary focus-within:outline-none focus-within:shadow-none focus:shadow-none mr-4 ml-4 text-center"
            />
          </div>

          {/* Name */}
          <div className="mb-2 mt-2 flex flex-row justify-between items-center w-full h-full">
            <label className="pl-5 font-bold">Name</label>
            <input
              placeholder="Name"
              type="text"
              name="name"
              value={createFormData.name}
              onChange={handleChange}
              className="w-25 border-b-2 border-l-0 border-r-0 border-t-0 border-gray-300 bg-transparent text-gray-500 font-medium text-md h-14 focus:outline-none focus:ring-0 focus:border-primary focus-within:outline-none focus-within:shadow-none focus:shadow-none mr-4 ml-4 text-center"
            />
          </div>

          {/* Bank Fee */}
          <div className="mb-2 mt-2 flex flex-row justify-between items-center w-full h-full">
            <label className="pl-5 font-bold">Bank Fee %</label>
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
            <label className="pl-5 font-bold">Creator Fee %</label>
            <input
              placeholder="Creator Fee"
              type="number"
              name="creatorFee"
              value={createFormData.creatorFee}
              onChange={handleChange}
              className="w-25 border-b-2 border-l-0 border-r-0 border-t-0 border-gray-300 bg-transparent text-gray-500 font-medium text-md h-14 focus:outline-none focus:ring-0 focus:border-primary focus-within:outline-none focus-within:shadow-none focus:shadow-none mr-4 ml-4 text-center"
            />
          </div>

          {/*/!* UI Promotion Fee *!/*/}
          {/*<div className="mb-2 mt-2 flex flex-row justify-between items-center w-full h-full">*/}
          {/*    <label className="pl-5 font-bold">*/}
          {/*        UI Promotion Fee %*/}
          {/*    </label>*/}
          {/*    <input*/}
          {/*        placeholder="UI Promotion Fee"*/}
          {/*        type="number"*/}
          {/*        name="uiPromotionFee"*/}
          {/*        value={createFormData.uiPromotionFee}*/}
          {/*        onChange={handleChange}*/}
          {/*        className="w-25 border-b-2 border-l-0 border-r-0 border-t-0 border-gray-300 bg-transparent text-gray-500 font-medium text-md h-14 focus:outline-none focus:ring-0 focus:border-primary focus-within:outline-none focus-within:shadow-none focus:shadow-none mr-4 ml-4 text-center"*/}
          {/*    />*/}
          {/*</div>*/}

          <button
            disabled={false}
            type="submit"
            className="w-full focus:outline-none text-white primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300 font-medium rounded text-md  px-4 py-3"
          >
            Create
          </button>
        </form>
      </div>
      <SelectTokenModal
        network={props.network}
        createFormData={createFormData}
        setCreateFormData={setCreateFormData}
        displaySelectTokenModal={displaySelectTokenModal}
        setDisplaySelectTokenModal={setDisplaySelectTokenModal}
      />
    </>
  );
};
export default CreateForm;
