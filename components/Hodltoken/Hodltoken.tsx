import React, { useState, useEffect } from 'react';
import HeaderCardsV2 from '../shared/HeaderCardsV2';
import MintingHodlTOKEN from './ui/MintingHodlTOKEN';
import BurningHoldTOKEN from './ui/BurningHodlTOKEN';
import DepositingHoldTOKEN from './ui/DepositingHodlTOKEN';
import SearchBarHodl from './ui/SearchBarHodl';

import commonStyle from '../../styles/common.module.css';
import Image from 'next/image';
import filter_icon from '../../assest/images/checkout/filter_icon.svg';
import filter_icon_descend from '../../assest/images/checkout/filter_icon_descend.svg';
import { useAdvancedSettings } from '@/context/AdvansedSettings';
import SwiperSlider from '../TopPromotedFive/SwiperSlider/SwiperSlider';
import {
  addressFromContractId,
  ALPH_TOKEN_ID,
  contractIdFromAddress,
  hexToString,
  NodeProvider
} from '@alephium/web3';
import { getFactoryConfig } from '@/blockchain/alephium/services/utils';
import { HodlBankContract } from '@/blockchain/alephium/phoenixContracts/BankContracts/HodlBankContract';
import { formatBigIntWithDecimalsRounded } from '@/common/utils';
import MintingHodlAlph from '@/components/Hodlerg/HodlAlph/MintingHodlAlph';
import BurningHodlAlph from '@/components/Hodlerg/HodlAlph/BurningHodlAlph';
import { ALPH_NODE_URL } from '@/blockchain/alephium/constants';

interface IProps {
  network: string | null;
}

interface GameData {
  currentPrice: string;
  circulatingSupply: string;
  tvl: string;
}

interface HodlToken {
  id: number;
  contractId: string;
  baseTokenId: string;
  decimals: number;
  baseToken: string;
  title: string;
  bankFee: number;
  gameData: GameData;
}

const tokenData = [
  {
    id: 1001,
    baseToken: 'COMET',
    title: 'hodlCOMET',
    bankFee: 3,
    gameData: {
      currentPrice: 1,
      circulatingSupply: 1,
      tvl: 1
    }
  },
  {
    id: 1002,
    baseToken: 'SigUSD',
    title: 'hodlSigUSD',
    bankFee: 4,
    gameData: {
      currentPrice: 1,
      circulatingSupply: 1,
      tvl: 1
    }
  },
  {
    id: 1003,
    baseToken: 'SigUSD',
    title: 'hodlSigUSD',
    bankFee: 14,
    gameData: {
      currentPrice: 1,
      circulatingSupply: 1,
      tvl: 1
    }
  },
  {
    id: 1004,
    baseToken: 'SPF',
    title: 'hodlSPF',
    bankFee: 2,
    gameData: {
      currentPrice: 1,
      circulatingSupply: 1,
      tvl: 1
    }
  },
  {
    id: 1005,
    baseToken: 'SPF',
    title: 'hodlSPF',
    bankFee: 20,
    gameData: {
      currentPrice: 1,
      circulatingSupply: 1,
      tvl: 1
    }
  },
  {
    id: 1006,
    baseToken: 'SPF',
    title: 'hodlSPF',
    bankFee: 7,
    gameData: {
      currentPrice: 1,
      circulatingSupply: 1,
      tvl: 1
    }
  },
  {
    id: 1007,
    baseToken: 'SPF',
    title: 'hodlSPF',
    bankFee: 10,
    gameData: {
      currentPrice: 1,
      circulatingSupply: 1,
      tvl: 1
    }
  }
  // Add more tokens if needed
];

const Hodltoken = (props: IProps) => {
  const { network } = props;
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tokensList, setTokensList] = useState<HodlToken[]>([]);
  const [ascendingOrder, setAscendingOrder] = useState<boolean>(true);
  const { advancedSettings } = useAdvancedSettings();

  // const sortTokens = () => {
  //     const sortedTokens = [...tokenData]
  //         .filter((token) => token.baseToken.toLowerCase().includes(searchQuery.toLowerCase()))
  //         .sort((a, b) => (ascendingOrder ? a.bankFee - b.bankFee : b.bankFee - a.bankFee));
  //     setTokensList(sortedTokens);
  // };

  useEffect(() => {
    // sortTokens();
    // get all events from factory contract
    // get all contract ids
    // add info into tokensList
    // use placeholder array for ergo

    // id: number;
    // baseToken: string;
    // title: string;
    // bankFee: number;
    // gameData: GameData;

    switch (network) {
      case '1':
      case '3':
      default: {
        // setTokensList(tokensList);
        // sortTokens();
        break;
      }
      case '4':
      case '5':
      case '6': {
        const nodeProvider = new NodeProvider(ALPH_NODE_URL(network));

        nodeProvider.events
          .getEventsContractContractaddress(getFactoryConfig(network).factoryAddress, {
            start: 0,
            limit: 100
          })
          .then((events) => {
            const tokensPromises = events.events.map(async (event, index) => {
              const fields = event.fields;
              const creator = fields[0].value as string;
              const contractId = fields[1].value as string;
              const baseTokenId = fields[2].value as string;
              const bankFeeNum = fields[3].value as string;

              const hodlTokenMetadata = await nodeProvider.fetchFungibleTokenMetaData(contractId);
              const baseTokenMetadata = await nodeProvider.fetchFungibleTokenMetaData(
                baseTokenId as string
              );
              const hodlTokenName = hodlTokenMetadata.name;
              const hodlTokenDecimals = hodlTokenMetadata.decimals;
              const baseTokenTicker = baseTokenMetadata.symbol;

              const hodlBankContract = new HodlBankContract(
                addressFromContractId(contractId),
                network
              );

              const currentPrice = await hodlBankContract.mintAmount(
                BigInt(10) ** BigInt(hodlTokenDecimals)
              );
              const circulatingSupply = await hodlBankContract.getHodlALPHEmissionAmount();
              const tvl = await hodlBankContract.getTVL();

              return {
                id: index,
                baseTokenId,
                contractId,
                decimals: hodlTokenDecimals,
                baseToken: hexToString(baseTokenTicker),
                title: hexToString(hodlTokenName),
                bankFee: parseFloat(bankFeeNum) / 100,
                gameData: {
                  currentPrice: formatBigIntWithDecimalsRounded(currentPrice, hodlTokenDecimals, 4),
                  circulatingSupply: formatBigIntWithDecimalsRounded(
                    circulatingSupply,
                    hodlTokenDecimals,
                    4
                  ),
                  tvl: formatBigIntWithDecimalsRounded(tvl, hodlTokenDecimals, 4)
                }
              };
            });
            Promise.all(tokensPromises).then((tokens) => {
              console.log(tokens);
              setTokensList(tokens);
              // sortTokens();
            });
          });
        break;
      }
    }
  }, []);

  const loading = (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <button
        disabled
        type="button"
        className="text-white bg-primary  font-medium rounded text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
      >
        <svg
          aria-hidden="true"
          role="status"
          className="inline w-4 h-4 mr-3 text-white animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
        Loading...
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      {/*<SwiperSlider />*/}
      {/*<div className="relative bg-gray-200 shadow-lg flex content-between items-center rounded-md w-[350px] lg:w-[800px]">*/}
      {/*    <SearchBarHodl searchQuery={searchQuery} setSearchQuery={setSearchQuery} />*/}
      {/*    <div*/}
      {/*        onClick={() => setAscendingOrder(!ascendingOrder)}*/}
      {/*        className="w-1/4 flex items-center justify-center cursor-pointer text-center text-xs lg:text-lg lg:font-bold"*/}
      {/*    >*/}
      {/*        Bank Fee*/}
      {/*        <span className="pl-2">*/}
      {/*            {ascendingOrder ?*/}
      {/*                <Image alt='img' src={filter_icon_descend} className={commonStyle.tokenIconImg} height='20' width='20' /> :*/}
      {/*                <Image alt='img' src={filter_icon} className={commonStyle.tokenIconImg} height='20' width='20' />}*/}
      {/*        </span>*/}
      {/*    </div>*/}
      {/*</div>*/}

      {tokensList.length === 0 ? (
        loading
      ) : (
        <>
          {tokensList.map(
            ({ id, baseToken, title, bankFee, gameData, contractId, baseTokenId, decimals }) => (
              <div key={id} className="max-w-l mx-auto font-inter my-10 mx-20">
                <div className="bg-gray-200 shadow-lg flex content-between rounded-md w-[350px] lg:w-[800px]  flex-col lg:flex-row p-2">
                  <div className="container mx-auto flex flex-col justify-between">
                    <div className="text-black mt-5 text-center text-2xl font-extrabold text-red-800">
                      {title} {bankFee}%
                    </div>
                    <HeaderCardsV2
                      title="Price"
                      amount={parseFloat(gameData.currentPrice)}
                      token={baseToken}
                    />
                    <HeaderCardsV2
                      title="Supply"
                      amount={parseFloat(gameData.circulatingSupply)}
                      token={`hodl${baseToken}`}
                    />
                    <HeaderCardsV2
                      title="Reserve"
                      amount={parseFloat(gameData.tvl)}
                      token={baseToken}
                    />
                  </div>
                  <div className="container mx-auto border lg:border-l-gray-300 flex flex-col items-center justify-around">
                    <MintingHodlAlph
                      network={network}
                      percent={bankFee.toString()}
                      baseTokenTicker={baseToken}
                      baseTokenId={baseTokenId}
                      contractId={contractId}
                      decimals={decimals}
                    />
                    <BurningHodlAlph
                      network={network}
                      percent={bankFee.toString()}
                      baseTokenTicker={baseToken}
                      baseTokenId={baseTokenId}
                      contractId={contractId}
                      decimals={decimals}
                    />
                    {advancedSettings && <DepositingHoldTOKEN token={baseToken} />}
                  </div>
                </div>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default Hodltoken;
