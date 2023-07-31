import React, { useContext, useEffect, useRef } from 'react';
import SideBar from '../Common/SideBar';
import submitStyles from '../../styles/Submit.module.css';
import { FaRegDotCircle } from 'react-icons/fa';
// @ts-ignore
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Image from 'next/image';
import currencyLogo from '../../assest/images/Ergo_input_logo.svg';
import Link from 'next/link';
import navStyle from '../../styles/navbar.module.css';
import Social from './Social';
import Royality from './Royality';
import { FormContext } from '../../pages/_app';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { noti_option_close } from '../Notifications/Toast';
import { ErgoAddress, Network } from '@fleet-sdk/core';
import { Tooltip } from 'antd';
import FlatpickerMin from '../Calender/FlatpickerMin';
import FlatpickerMax from '../Calender/FlatpickerMax';
import {
  getDecimalCount,
  isCustomTokenValid,
} from '../../blockchain/ergo/api';
import moment from 'moment';

export const generateKey = (pre: any) => {
  return `${pre}${new Date().getTime()}`;
};
const CreateCollection = () => {
  const {
    formValue,
    setFormValue,
    isNeverEx,
    setIsNeverEx,
    isCollectionBurn,
    setIsCollectionBurn,
    isCollectionReturn,
    setIsCollectionReturn,
    addressVerify,
    setAddressVerify,
    minDate,
    setMinDate,
    maxDate,
    setMaxDate,
    minTime,
    setMinTime,
    maxTime,
    setMaxTime,
    handleFormData,
    handleForm,
    usePool,
    setUsePool,
    isPremint,
    setIsPremint,
    isWhitelistToken,
    setIsWhitelistToken,
    isWhitelistByPass,
    setIsWhitelistByPass,
    isCustomToken,
    setIsCustomToken,
    isAcceptErgoToken,
    setIsAcceptErgoToken,
    minDateTime,
    setMinDateTime,
    maxDateTime,
    setMaxDateTime,
  } = useContext<any>(FormContext);
  const { push } = useRouter();

  // Load the form data from local storage on component mount
  useEffect(() => {
    const storedFormData = localStorage.getItem('myData');
    if (storedFormData) {
      const localData = JSON.parse(storedFormData);
      setFormValue(localData);
    }
  }, []);

  useEffect(() => {
    setIsCollectionBurn(formValue.isCollectionBurn);
    setIsCollectionReturn(formValue.isCollectionReturn);
    setIsNeverEx(formValue.isNeverEx);
    if (formValue.minDate) {
      setMinDate(new Date(formValue.minDate));
    }
    if (formValue.maxDate) {
      setMaxDate(new Date(formValue.maxDate));
    }
    if (formValue.minTime) {
      setMaxTime(formValue.minTime);
    }
    if (formValue.maxTime) {
      setMinTime(formValue.maxTime);
    }
    if(formValue.isPremint !== undefined){
      setIsPremint(formValue.isPremint);
    }
    if(formValue.isWhitelistByPass !== undefined){
      setIsWhitelistByPass(formValue.isWhitelistByPass);
    }
    if(formValue.isWhitelistToken !== undefined){
      setIsWhitelistToken(formValue.isWhitelistToken);
    }
    if(formValue.usePool !== undefined){
      setUsePool(formValue.usePool);
    }
    if(formValue.isCustomToken !== undefined){
      setIsCustomToken(formValue.isCustomToken);
    }
    if(formValue.isAcceptErgoToken !== undefined){
      setIsAcceptErgoToken(formValue.isAcceptErgoToken);
    }
    if(formValue.minDateTime){
      setMinDateTime(moment.utc(formValue.minDateTime))

    }
    if(formValue.maxDateTime){
      setMaxDateTime(moment.utc(formValue.maxDateTime))
    }
  }, [formValue]);

  const clearForm = useRef(null);

  function handleMinTimeChange(event: any) {
    setMinTime(event.target.value);
  }

  function handleMaxTimeChange(event: any) {
    setMaxTime(event.target.value);
  }

  const handleAllClear = () => {
    localStorage.removeItem('myData');
    setFormValue({
      socialData: [
        { socialName: '', socialAddress: '', _id: generateKey('social__') },
      ],
      royality: [{ address: '', amount: 0, _id: generateKey('slider__') }],
    });
    setMinDate(new Date());
    setMaxDate(minDate.getTime() + 86400000);
    setMinTime('06:00');
    setMaxTime('06:00');
    // @ts-ignore
    clearForm.current.reset();
  };

  const handleFormSubmit = (e: any) => {
    const {
      collectionBannerImageUrl,
      collectionCategory,
      collectionDescription,
      collectionFeaturedImageUrl,
      collectionLogoUrl,
      collectionName,
      collectionSize,
    } = formValue;

    const isMainnet = localStorage.getItem('IsMainnet') ? JSON.parse(localStorage.getItem('IsMainnet')!) as boolean : true;

    // Validate all non-empty royalty addresses after trimming white spaces
    const areRoyaltyAddressesValid = formValue.royality.every((royal: any) => {
      const address = royal.address.trim();
      return (
        address === '' ||
        (ErgoAddress.validate(address) &&
          ErgoAddress.getNetworkType(address) ===
            (isMainnet ? Network.Mainnet : Network.Testnet))
      );
    });

    const mintPriceValid = parseFloat(formValue.mintPrice) >= 0.1;
    const mintPriceDecimalValid = getDecimalCount(formValue.mintPrice) <= 9;
    const isExponentPresent = (num: string) => num.indexOf('e') !== -1;

    const checkMintExpirySelection = !isNeverEx ? isCollectionBurn || isCollectionReturn : true;

    const checkWhitelist = isWhitelistByPass ? isWhitelistToken : true; // if whitelist bypass is true then whitelist token should be true
    const checkAcceptErg = !isAcceptErgoToken ? isCustomToken : true; // if not accept erg is true then custom token should be true
    const validateTokenIsPositiveInteger = (num: number) => {
      if (isNaN(num)) {
        return false;
      }
      return num > 0 && Number.isInteger(num);
    };

    isCustomTokenValid(formValue.custom_token_id, isMainnet, isCustomToken).then((res) => {
      const [isTokenValid, tokenInfo] = res;
      const validations = [
        {
          check: collectionBannerImageUrl,
          message: 'collection banner image URL is required',
        },
        // ... add other fields here
        { check: areRoyaltyAddressesValid, message: 'invalid royalty address' },
        {
          check: mintPriceValid,
          message: 'mint price must be at least 0.1 ERG',
        },
        {
          check: mintPriceDecimalValid,
          message: 'mint price cannot have more than 9 decimals',
        },
        {
          check: !isExponentPresent(formValue.mintPrice),
          message: 'no exponents allowed for mint price',
        },
        {
          check: !isExponentPresent(collectionSize),
          message: 'no exponents allowed for collection size',
        },
        {
          check: validateTokenIsPositiveInteger(parseFloat(collectionSize)),
          message: 'collection size must be a positive whole number',
        },
        {
          check: checkMintExpirySelection,
          message: 'select an option for mint expiry or on sale end',
        },
        {
          check: checkWhitelist,
          message:
            'whitelist token must be enabled if whitelist bypass is enabled',
        },
        {
          check: !isNeverEx ? maxDateTime > minDateTime : true,
          message: `mint expiry time must be after mint start time`,
        },
        {
          check: isWhitelistToken
            ? validateTokenIsPositiveInteger(
                parseFloat(formValue.whitelistToken_amount),
              )
            : true,
          message: `whitelist token amount must be a positive whole number`,
        },
        {
          check: isWhitelistToken
            ? !isExponentPresent(formValue.whitelistToken_amount)
            : true,
          message: `whitelist token amount cannot contain exponents`,
        },
        {
          check: usePool
            ? validateTokenIsPositiveInteger(
                parseFloat(formValue.pool_amount),
              ) && parseFloat(formValue.pool_amount) <= collectionSize
            : true,
          message: `pool can provide liquidity up to ${collectionSize} whole NFTs`,
        },
        {
          check: usePool ? !isExponentPresent(formValue.pool_amount) : true,
          message: `pool liquidity cannot contain exponents`,
        },
        {
          check: isPremint
            ? validateTokenIsPositiveInteger(
                parseFloat(formValue.premint_amount),
              )
            : true,
          message: `premint token amount must be a positive whole number`,
        },
        {
          check: isPremint
            ? !isExponentPresent(formValue.premint_amount)
            : true,
          message: `premint token amount cannot contain exponents`,
        },
        {
          check: checkAcceptErg,
          message: 'custom token must be enabled if accept erg is disabled',
        },
        { check: isTokenValid, message: 'custom token id is invalid' },
        {
          check: isCustomToken
            ? getDecimalCount(formValue.custom_token_amount) <=
                tokenInfo.decimals! &&
              parseFloat(formValue.custom_token_amount) > 0
            : true,
          message: `custom token amount is invalid, decimals are more than token decimals of ${tokenInfo.decimals}`,
        },
      ];

      const invalid = validations.find((v) => !v.check);

      if (invalid) {
        console.log(invalid.message);
        toast.warn(invalid.message, noti_option_close('try-again'));
      } else {
        handleForm(e);
        push('/uploads');
      }
    });
  };

  const handlePoolDisable = () => {
    setUsePool(false);
    localStorage.setItem(
      'myData',
      JSON.stringify({
        ...formValue,
        pool_amount: '',
      }),
    );
  };

  const handlePremintDisable = () => {
    setIsPremint(false);
    localStorage.setItem(
      'myData',
      JSON.stringify({
        ...formValue,
        premint_amount: '',
      }),
    );
  };

  const handleWhitelistTokenDisable = () => {
    setIsWhitelistToken(false);
    localStorage.setItem(
      'myData',
      JSON.stringify({
        ...formValue,
        whitelistToken_amount: '',
      }),
    );
  };
  const handleCustomTokenDisable = () => {
    setIsCustomToken(false);
    localStorage.setItem(
      'myData',
      JSON.stringify({
        ...formValue,
        custom_token_id: '',
        custom_token_amount: '',
      }),
    );
  };

  useEffect(() => {
    setIsPremint(formValue.isPremint);
    setIsWhitelistToken(formValue.isWhitelistToken);
    setIsCustomToken(formValue.isCustomToken);
  }, [
    formValue.isPremint,
    formValue.isWhitelistToken,
    formValue.isCustomToken,
  ]);
  return (
    <section className="row px-3">
      <SideBar />

      <form
        ref={clearForm}
        id="myForm"
        className={`col-12 col-md-7`}
        onSubmit={(e) => e.preventDefault()}
      >
        <div className={submitStyles.createCollectionContainer}>
          <h1 className={submitStyles.title}>CREATE YOUR COLLECTION</h1>
          <h2 className={submitStyles.subTitle}>
            <b>COLLECTIONS DETAILS</b>
          </h2>
          <p className={submitStyles.text}>
          </p>

          <div style={{ fontFamily: `'Inter', sans-serif` }}>
            <div className="relative rounded border border-solid border-white mt-8">
              <input
                type="text"
                id="Collection_Name"
                onChange={(e) => handleFormData(e)}
                name="collectionName"
                defaultValue={formValue?.collectionName || ''}
                className="block rounded  px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none text-white border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="Collection_Name"
                className="absolute text-sm text-white-500 text-white-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-white-600 peer-focus:text-white-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Collection Name
              </label>
            </div>

            <div className="relative rounded border border-solid border-white mt-8">
              <input
                type="text"
                id="Collection_Description"
                onChange={(e) => handleFormData(e)}
                name="collectionDescription"
                defaultValue={formValue?.collectionDescription || ''}
                className="block rounded  px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none text-white border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="Collection_Description"
                className="absolute text-sm text-white-500 text-white-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-white-600 peer-focus:text-white-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Collection Description
              </label>
            </div>

            <div className="relative rounded border border-solid border-white mt-8">
              <input
                type="text"
                id="Collection_Category"
                onChange={(e) => handleFormData(e)}
                name="collectionCategory"
                defaultValue={formValue?.collectionCategory || ''}
                className="block rounded  px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none text-white border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="Collection_Category"
                className="absolute text-sm text-white-500 text-white-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-white-600 peer-focus:text-white-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Collection Category
              </label>
            </div>

            <div className="relative rounded border border-solid border-white mt-8">
              <input
                type="text"
                id="collection_LogoUrl"
                onChange={(e) => handleFormData(e)}
                defaultValue={formValue?.collectionLogoUrl || ''}
                name="collectionLogoUrl"
                className="block rounded  px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none text-white border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="collection_LogoUrl"
                className="absolute text-sm text-white-500 text-white-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-white-600 peer-focus:text-white-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Collection Logo Url
              </label>
            </div>

            <div className="relative rounded border border-solid border-white mt-8">
              <input
                type="text"
                id="collection_Featured_ImageUrl"
                onChange={(e) => handleFormData(e)}
                defaultValue={formValue?.collectionFeaturedImageUrl || ''}
                name="collectionFeaturedImageUrl"
                className="block rounded  px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none text-white border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="collection_Featured_ImageUrl"
                className="absolute text-sm text-white-500 text-white-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-white-600 peer-focus:text-white-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Collection featured image url
              </label>
            </div>

            <div className="relative rounded border border-solid border-white mt-8">
              <input
                type="text"
                id="collection_Banner_ImageUrl"
                onChange={(e) => handleFormData(e)}
                name="collectionBannerImageUrl"
                defaultValue={formValue?.collectionBannerImageUrl || ''}
                className="block rounded  px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none text-white border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="collection_Banner_ImageUrl"
                className="absolute text-sm text-white-500 text-white-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-white-600 peer-focus:text-white-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Collection banner image url
              </label>
            </div>

            <div className="relative rounded border border-solid border-white mt-8">
              <input
                type="number"
                id="collection_Size"
                onChange={(e) => handleFormData(e)}
                name="collectionSize"
                defaultValue={parseInt(formValue?.collectionSize) || ''}
                className="block rounded  px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none text-white border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                min={0}
              />
              <label
                htmlFor="collection_Size"
                className="absolute text-sm text-white-500 text-white-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-white-600 peer-focus:text-white-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Collection Size
              </label>
            </div>
          </div>

          {/* SOCIAL PART START */}
          <Social formValue={formValue} />

          {/* ROYALITIES PART START */}

          <Royality
            formValue={formValue}
            addressVerify={addressVerify}
            setAddressVerify={setAddressVerify}
          />
          <hr className="my-5" />
          {/* MINT PRICE PART START */}
          <div>
            <h2 className={submitStyles.mintHeaderTitle}>Mint Configuration</h2>
          </div>

          <h2 className={submitStyles.subTitle}>set mint price</h2>
          <div
            className="relative rounded border border-solid border-white mt-10 "
            style={{ fontFamily: `'Inter', sans-serif` }}
          >
            <div className="absolute inset-y-0 right-4 flex items-center pl-3 pointer-events-none">
              <Image src={currencyLogo} alt="a" width={24} height={24} />
            </div>
            <input
              type="number"
              id="mint_price"
              name="mintPrice"
              className="block rounded  px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none text-white border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={formValue?.mintPrice}
              onChange={(e) => handleFormData(e)}
            />

            <label
              htmlFor="mint_price"
              className="absolute text-sm text-white-500 text-white-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-white-600 peer-focus:text-white-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Price
            </label>
          </div>
          {/*date time section*/}

          <div>
            {/*1st*/}
            <div
              className="d-flex justify-content-between align-items-center mt-8"
              style={{ fontFamily: `'Inter', sans-serif` }}
            >
              <h2 className={submitStyles.mintTitle}>MINT START</h2>
              <div className="d-flex">
                <FlatpickerMin />
              </div>
            </div>
            {/*2nd*/}
            <div
              className="d-flex justify-content-between align-items-center mt-8"
              style={{ fontFamily: `'Inter', sans-serif` }}
            >
              <h2 className={submitStyles.mintTitle}>MINT EXPIRY</h2>
              <div className="d-flex">
                {isNeverEx ? null : <FlatpickerMax />}
              </div>
            </div>
          </div>

          <div>
            {isNeverEx ? (
              <div
                className="d-flex"
                onClick={() => {
                  setIsNeverEx(!isNeverEx);
                  setIsCollectionBurn(false);
                  setIsCollectionReturn(false);
                }}
              >
                <FaRegDotCircle
                  className="fs-3 me-3"
                  style={{ color: '#E041E7' }}
                />
                <p
                  className="d-flex align-items-center pt-1 fw-bold"
                  style={{ fontFamily: `'Inter', sans-serif` }}
                >
                  Never Expire
                </p>
              </div>
            ) : (
              <div
                className="d-flex"
                onClick={() => {
                  setIsNeverEx(!isNeverEx);
                  setIsCollectionBurn(false);
                  setIsCollectionReturn(false);
                }}
              >
                <FaRegDotCircle className="fs-3 text-white me-3" />
                <p
                  className="d-flex align-items-center pt-1 fw-bold"
                  style={{ fontFamily: `'Inter', sans-serif` }}
                >
                  Never Expire
                </p>
              </div>
            )}
          </div>

          {/*ON SALE END buttons section */}
          <div className="d-flex justify-content-between align-items-center">
            <p className={submitStyles.subTitle}>ON SALE END</p>

            {isNeverEx ? (
              <div
                className="d-flex"
                style={{ fontFamily: `'Inter', sans-serif` }}
              >
                <button
                  disabled
                  type="button"
                  className="cursor-not-allowed text-white hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                >
                  Collection Token Burn
                </button>
                <button
                  disabled
                  type="button"
                  className=" cursor-not-allowed text-white hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center  border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                >
                  Collection Token Return
                </button>
              </div>
            ) : (
              <div className="d-flex">
                {isCollectionBurn === true ? (
                  <button
                    onClick={() => {
                      setIsCollectionBurn(true);
                      setIsCollectionReturn(false);
                      setIsNeverEx(false);
                    }}
                    type="button"
                    style={{ fontFamily: `'Inter', sans-serif` }}
                    className="text-warning hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                  >
                    Collection Token Burn
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsCollectionBurn(true);
                      setIsCollectionReturn(false);
                      setIsNeverEx(false);
                    }}
                    type="button"
                    style={{ fontFamily: `'Inter', sans-serif` }}
                    className="text-white hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                  >
                    Collection Token Burn
                  </button>
                )}

                {isCollectionReturn === true ? (
                  <button
                    onClick={() => {
                      setIsCollectionReturn(true);
                      setIsCollectionBurn(false);
                      setIsNeverEx(false);
                    }}
                    type="button"
                    style={{ fontFamily: `'Inter', sans-serif` }}
                    className="text-warning hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                  >
                    Collection Token Return
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsCollectionReturn(true);
                      setIsCollectionBurn(false);
                      setIsNeverEx(false);
                    }}
                    type="button"
                    style={{ fontFamily: `'Inter', sans-serif` }}
                    className=" text-white hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                  >
                    Collection Token Return
                  </button>
                )}
              </div>
            )}
          </div>

          {/*Pool section start */}
          <div className="d-flex justify-content-between align-items-start mt-6">
            <Tooltip
              placement="topLeft"
              title={
                "Artist covers buyers' extra costs associated with minting"
              }
            >
              <p className={submitStyles.subTitleBottom}>POOL</p>
            </Tooltip>

            <div className="">
              <div className="d-flex justify-content-end">
                {usePool ? (
                  <div>
                    <button
                      onClick={() => setUsePool(true)}
                      type="button"
                      style={{ fontFamily: `'Inter', sans-serif` }}
                      className="text-warning
                 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                    >
                      Enable
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setUsePool(true)}
                    type="button"
                    style={{ fontFamily: `'Inter', sans-serif` }}
                    className="text-white
                 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                  >
                    Enable
                  </button>
                )}

                {usePool === false ? (
                  <button
                    onClick={() => handlePoolDisable()}
                    type="button"
                    style={{ fontFamily: `'Inter', sans-serif` }}
                    className="text-warning hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                  >
                    Disable
                  </button>
                ) : (
                  <button
                    onClick={() => handlePoolDisable()}
                    type="button"
                    style={{ fontFamily: `'Inter', sans-serif` }}
                    className="text-white hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                  >
                    Disable
                  </button>
                )}
              </div>
              {usePool && (
                <div className="relative rounded border border-solid border-white mt-8">
                  <input
                    style={{ fontFamily: `'Inter', sans-serif` }}
                    type="number"
                    id="pool_amount"
                    onChange={(e) => handleFormData(e)}
                    defaultValue={formValue?.pool_amount || ''}
                    name="pool_amount"
                    className="block rounded  px-2.5 pb-1 pt-5 w-full text-sm bg-gray-700 border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder="NFTs to fund"
                    required
                  />
                  <label
                    style={{ fontFamily: `'Inter', sans-serif` }}
                    htmlFor="pool_amount"
                    className="absolute text-sm text-white-500 text-white-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-white-600 peer-focus:text-white-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Token amount
                  </label>
                </div>
              )}
            </div>
          </div>
          {/*Pool Token section end */}

          {/*Premint Token section start */}
          <div className="d-flex justify-content-between align-items-start mt-6">
            <Tooltip
              placement="topLeft"
              title={
                'Allows mint before start time, buyer must pay full NFT price, tokens sent to artist address'
              }
            >
              <p className={submitStyles.subTitleBottom}>PREMINT TOKEN</p>
            </Tooltip>

            <div className="">
              <div className="d-flex justify-content-end">
                {isPremint ? (
                  <div>
                    <button
                      onClick={() => setIsPremint(true)}
                      type="button"
                      style={{ fontFamily: `'Inter', sans-serif` }}
                      className="text-warning
                 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                    >
                      Enable
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsPremint(true)}
                    type="button"
                    style={{ fontFamily: `'Inter', sans-serif` }}
                    className="text-white
                 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                  >
                    Enable
                  </button>
                )}

                {isPremint === false ? (
                  <button
                    onClick={() => handlePremintDisable()}
                    type="button"
                    style={{ fontFamily: `'Inter', sans-serif` }}
                    className="text-warning hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                  >
                    Disable
                  </button>
                ) : (
                  <button
                    onClick={() => handlePremintDisable()}
                    type="button"
                    style={{ fontFamily: `'Inter', sans-serif` }}
                    className="text-white hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                  >
                    Disable
                  </button>
                )}
              </div>
              {isPremint && (
                <div className="relative rounded border border-solid border-white mt-8">
                  <input
                    style={{ fontFamily: `'Inter', sans-serif` }}
                    type="number"
                    id="premint_amount"
                    onChange={(e) => handleFormData(e)}
                    defaultValue={formValue?.premint_amount || ''}
                    name="premint_amount"
                    className="block rounded  px-2.5 pb-1 pt-5 w-full text-sm bg-gray-700 border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder="Premint tokens to mint"
                    required
                  />
                  <label
                    style={{ fontFamily: `'Inter', sans-serif` }}
                    htmlFor="premint_amount"
                    className="absolute text-sm text-white-500 text-white-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-white-600 peer-focus:text-white-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Token amount
                  </label>
                </div>
              )}
            </div>
          </div>
          {/*Premint Token section end */}

          {/*Whitelist Token section start */}
          <div className="d-flex justify-content-between align-items-start mt-7">
            <Tooltip
              placement="topLeft"
              title={
                'Allows free mint (ERG for lilium fee must be paid), WL tokens sent to artist address'
              }
            >
              <p className={submitStyles.subTitleBottom}>WHITELIST TOKEN</p>
            </Tooltip>

            <div className="">
              <div className="d-flex justify-content-end">
                {isWhitelistToken ? (
                  <div>
                    <button
                      onClick={() => setIsWhitelistToken(true)}
                      type="button"
                      style={{ fontFamily: `'Inter', sans-serif` }}
                      className="text-warning
                 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                    >
                      Enable
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsWhitelistToken(true)}
                    type="button"
                    style={{ fontFamily: `'Inter', sans-serif` }}
                    className="text-white
                 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                  >
                    Enable
                  </button>
                )}

                {isWhitelistToken === false ? (
                  <button
                    onClick={() => handleWhitelistTokenDisable()}
                    type="button"
                    style={{ fontFamily: `'Inter', sans-serif` }}
                    className="text-warning hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                  >
                    Disable
                  </button>
                ) : (
                  <button
                    onClick={() => handleWhitelistTokenDisable()}
                    type="button"
                    style={{ fontFamily: `'Inter', sans-serif` }}
                    className="text-white hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                  >
                    Disable
                  </button>
                )}
              </div>
              {isWhitelistToken && (
                <div className="relative rounded border border-solid border-white mt-8">
                  <input
                    style={{ fontFamily: `'Inter', sans-serif` }}
                    type="number"
                    id="whitelistToken_amount"
                    onChange={(e) => handleFormData(e)}
                    defaultValue={formValue?.whitelistToken_amount || ''}
                    name="whitelistToken_amount"
                    className="block rounded  px-2.5 pb-1 pt-5 w-full text-sm bg-gray-700 border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder="Whitelist tokens to mint"
                    required
                  />
                  <label
                    style={{ fontFamily: `'Inter', sans-serif` }}
                    htmlFor="whitelistToken_amount"
                    className="absolute text-sm text-white-500 text-white-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-white-600 peer-focus:text-white-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Token amount
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* bypass section  */}
          {isWhitelistToken && (
            <div className="d-flex justify-content-between align-items-start mt-2">
              <Tooltip
                placement="topLeft"
                title={'Allows whitelist token to be used before sale start'}
              >
                <p className={submitStyles.subTitleBottom}>WHITELIST BYPASS</p>
              </Tooltip>

              <div className="">
                <div className="d-flex justify-content-end">
                  {isWhitelistByPass ? (
                    <div>
                      <button
                        onClick={() => setIsWhitelistByPass(true)}
                        type="button"
                        style={{ fontFamily: `'Inter', sans-serif` }}
                        className="text-warning
                 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                      >
                        Enable
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsWhitelistByPass(true)}
                      type="button"
                      style={{ fontFamily: `'Inter', sans-serif` }}
                      className="text-white
                 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                    >
                      Enable
                    </button>
                  )}

                  {isWhitelistByPass === false ? (
                    <button
                      onClick={() => setIsWhitelistByPass(false)}
                      type="button"
                      style={{ fontFamily: `'Inter', sans-serif` }}
                      className="text-warning hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                    >
                      Disable
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsWhitelistByPass(false)}
                      type="button"
                      style={{ fontFamily: `'Inter', sans-serif` }}
                      className="text-white hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                    >
                      Disable
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          {/*whitelist Token section end */}

          {/*Custom Token section start */}
          <div className="d-flex justify-content-between align-items-start mt-7">
            <Tooltip
              placement="topLeft"
              title={'Allows mint with custom token'}
            >
              <p className={submitStyles.subTitleBottom}>CUSTOM TOKEN</p>
            </Tooltip>

            <div className="">
              <div className="d-flex justify-content-end">
                {isCustomToken ? (
                  <div>
                    <button
                      onClick={() => setIsCustomToken(true)}
                      type="button"
                      style={{ fontFamily: `'Inter', sans-serif` }}
                      className="text-warning
                 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                    >
                      Enable
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsCustomToken(true)}
                    type="button"
                    style={{ fontFamily: `'Inter', sans-serif` }}
                    className="text-white
                 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                  >
                    Enable
                  </button>
                )}

                {isCustomToken === false ? (
                  <button
                    onClick={() => handleCustomTokenDisable()}
                    type="button"
                    style={{ fontFamily: `'Inter', sans-serif` }}
                    className="text-warning hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                  >
                    Disable
                  </button>
                ) : (
                  <button
                    onClick={() => handleCustomTokenDisable()}
                    type="button"
                    style={{ fontFamily: `'Inter', sans-serif` }}
                    className="text-white hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                  >
                    Disable
                  </button>
                )}
              </div>
            </div>
          </div>
          {isCustomToken && (
            <div className="d-flex justify-content-end">
              <div className="relative rounded border border-solid border-white mt-8 mr-3">
                <input
                  style={{ fontFamily: `'Inter', sans-serif` }}
                  type="text"
                  id="custom_token_id"
                  onChange={(e) => handleFormData(e)}
                  defaultValue={formValue?.custom_token_id || ''}
                  name="custom_token_id"
                  className="block rounded  px-2.5 pb-1 pt-5 w-full text-sm bg-gray-700 border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  style={{ fontFamily: `'Inter', sans-serif` }}
                  htmlFor="custom_token_id"
                  className="absolute text-sm text-white-500 text-white-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-white-600 peer-focus:text-white-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Token Id
                </label>
              </div>
              <div className="relative rounded border border-solid border-white mt-8">
                <input
                  style={{ fontFamily: `'Inter', sans-serif` }}
                  type="number"
                  id="custom_token_amount"
                  onChange={(e) => handleFormData(e)}
                  defaultValue={formValue?.custom_token_amount || ''}
                  name="custom_token_amount"
                  className="block rounded  px-2.5 pb-1 pt-5 w-full text-sm bg-gray-700 border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder="Tokens per NFT"
                  required
                />
                <label
                  style={{ fontFamily: `'Inter', sans-serif` }}
                  htmlFor="custom_token_amount"
                  className="absolute text-sm text-white-500 text-white-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-white-600 peer-focus:text-white-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Token Amount
                </label>
              </div>
            </div>
          )}

          {/* ergo section  */}
          {isCustomToken && (
            <div className="d-flex justify-content-between align-items-start mt-2">
              <Tooltip
                placement="topLeft"
                title={'ERG will not be accepted if clicked'}
              >
                <p className={submitStyles.subTitleBottom}>Accept ERG</p>
              </Tooltip>

              <div className="">
                <div className="d-flex justify-content-end">
                  {isAcceptErgoToken ? (
                    <div>
                      <button
                        onClick={() => setIsAcceptErgoToken(true)}
                        type="button"
                        style={{ fontFamily: `'Inter', sans-serif` }}
                        className="text-warning
                 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                      >
                        Enable
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAcceptErgoToken(true)}
                      type="button"
                      style={{ fontFamily: `'Inter', sans-serif` }}
                      className="text-white
                 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                    >
                      Enable
                    </button>
                  )}

                  {isAcceptErgoToken === false ? (
                    <button
                      onClick={() => {
                        setIsAcceptErgoToken(false);
                        console.log('disabled');
                      }}
                      type="button"
                      style={{ fontFamily: `'Inter', sans-serif` }}
                      className="text-warning hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                    >
                      Disable
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsAcceptErgoToken(false);
                        console.log('disabled');
                      }}
                      type="button"
                      style={{ fontFamily: `'Inter', sans-serif` }}
                      className="text-white hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center mr-3 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
                    >
                      Disable
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          {/*Custom Token  Token section end */}
        </div>
        <div className={`d-flex justify-content-center`}>
          <div className={` d-flex justify-content-center me-2`}>
            {/*<Link href='/uploads' className={navStyle.navLinks}>*/}
            <button
              type="submit"
              onClick={(e) => handleFormSubmit(e)}
              className={`${submitStyles.nextButton} ${navStyle.navLinks}`}
            >
              NEXT
            </button>
            {/*</Link>*/}
          </div>
          <div
            className={` d-flex justify-content-center me-2`}
            onClick={handleAllClear}
          >
            <Link href="#" className={navStyle.navLinks}>
              <button type="submit" className={submitStyles.nextButton}>
                Clear All
              </button>
            </Link>
          </div>
        </div>
      </form>
    </section>
  );
};

export default CreateCollection;
