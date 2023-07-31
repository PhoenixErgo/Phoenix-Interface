import React, { useState } from 'react';
import SideBar from '../Common/SideBar';
import uploadStyles from '../../styles/Upload.module.css';
import submitStyles from '../../styles/Submit.module.css';
import { FaRegDotCircle } from 'react-icons/fa';
import ProgressBar from './ProgressBar';
// @ts-ignore
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Submit = () => {
  const inputStyle = submitStyles.input;
  const [socialDivs, setSocialDivs] = useState<any[]>([]);
  const [address, setAddress] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [minDate, setMinDate] = useState(new Date('2023-02-14'));
  const [maxDate, setMaxDate] = useState(new Date('2023-02-14'));
  const [minTime, setMinTime] = useState('06:00');
  const [maxTime, setMaxTime] = useState('06:00');

  function handleMinTimeChange(event:any) {
    setMinTime(event.target.value);
  }

  function handleMaxTimeChange(event:any) {
    setMaxTime(event.target.value);
  }


  // add more button code for social div

  const socialDiv = (
    <div className='row'>
      <div className='col-12 col-md-4'>
        <input
          name=''
          className={`${inputStyle} w-100`}
          type='text'
          placeholder="enter social name ex: Twitter'"
        />
      </div>
      <div className='col-12 col-md-7 '>
        <input
          name=''
          className={`${inputStyle} w-100`}
          type='text'
          placeholder='Enter Correnponding Link'
        />
      </div>
    </div>
  );

  const handleSocialField = () => {
    setSocialDivs([...socialDivs, socialDiv]);
  };

  // add more button for address

  const targetAddress = (
    <input
      name=''
      className={`${inputStyle} w-100`}
      type='text'
      placeholder='Enter Address'
    />
  );

  const handleAddress = () => {
    setAddress([...address, targetAddress]);
  };

  // form submission handler

  const handleForm = (e:any) => {
    e.preventDefault();
    const form = e.target;

    const collectionCategory = form.collectionCategory.value;
    const collectionLogoUrl = form.collectionLogoUrl.value;
    const collectionFeaturedImageUrl = form.collectionFeaturedImageUrl.value;
    const collectionBannerImageUrl = form.collectionBannerImageUrl.value;

    const socialName1 = form.socialName1.value;
    const socialLink1 = form.socialLink1.value;
    const socialName2 = form.socialName2.value;
    const socialLink2 = form.socialLink2.value;

    const address1 = form.address1.value;
    const min_Star_Date = form.minStarDate.value;
    const min_Start_Time = form.minStartime.value;
    const max_Expiry_Date = form.maxStarDate.value;
    const max_Expiry_Time = form.maxStarTime.value;

    const collectionDetailsData = {
      collectionCategory,
      collectionLogoUrl,
      collectionFeaturedImageUrl,
      collectionBannerImageUrl,
      socialName1,
      socialLink1,
      socialLink2,
      socialName2,
      address1,
      min_Star_Date,
      min_Start_Time,
      max_Expiry_Date,
      max_Expiry_Time,
    };
    // const jsondata = JSON.stringify(collectionDetailsData)
    console.log(collectionDetailsData);
    // document.getElementById('myForm').reset();
  };

  return (
    <section className='row px-3'>
      <SideBar />
      <form onSubmit={handleForm} id='myForm' className={`col-12 col-md-7`}>

        <div className={uploadStyles.uploadContainer}>
          <h1 className={submitStyles.title}>CREATE YOUR COLLECTIONS</h1>
          <h2 className={submitStyles.subTitle}>
            <b>COLLECTIONS DETAILS</b>
          </h2>
          <p className={submitStyles.text}>
            The ‘Collection name’ and ‘Description’ are written to the
            blockchain and can’t be <br /> changed after minting. They are
            always shown when the collection is displayed, <br /> for example
            when it’s listed on the marketplace.
          </p>
          <input
            name='collectionCategory'
            className={`${inputStyle} w-100 `}
            type='text'
            placeholder='Collection Category'
            required
          />


          <input
            name='collectionLogoUrl'
            className={`${inputStyle} w-100`}
            type='text'
            placeholder='Collection logo url'
            required
          />
          <input
            name='collectionFeaturedImageUrl'
            className={`${inputStyle} w-100`}
            type='text'
            placeholder='Collection featured image url'
            required
          />
          <input
            name='collectionBannerImageUrl'
            className={`${inputStyle} w-100`}
            type='text'
            placeholder="Collection banner image url'"
            required
          />

          {/* SOCIAL PART START */}

          <h2 className={submitStyles.subTitle}>Socials</h2>
          <div className='row'>
            <div className='col-12 col-md-4'>
              <input
                name='socialName1'
                className={`${inputStyle} w-100`}
                type='text'
                placeholder="enter social name ex: Twitter'"
                required
              />
            </div>
            <div className='col-12 col-md-8'>
              <input
                name='socialLink1'
                className={`${inputStyle} w-100`}
                type='text'
                placeholder='Enter Correnponding Link'
                required
              />
            </div>
            <div className='col-12 col-md-4'>
              <input
                name='socialName2'
                className={`${inputStyle} w-100`}
                type='text'
                placeholder='enter social name ex: Twitter'
              />
            </div>
            <div className='col-12 col-md-7'>
              <input
                name='socialLink2'
                className={`${inputStyle} w-100`}
                type='text'
                placeholder='Enter Correnponding Link'
              />
            </div>
            {socialDivs}
          </div>
          <button onClick={handleSocialField} className={submitStyles.button}>
            Add more
          </button>
          <hr className='my-5' />

          {/* ROYALITIES PART START */}

          <h2 className={submitStyles.subTitle}>ROYALTIES</h2>

          <p className={submitStyles.text}>
            Every time an NFT gets sold, the original owner receives a
            percentage of the sale <br /> price. You can set the amount here,
            and the payments will execute automatically.
          </p>
          <div className='d-flex justify-content-between fs-3 mt-5'>
            <p className=''>Amount</p>
            <p className=''>{progress} %</p>
          </div>
          <ProgressBar progress={progress} setProgress={setProgress} />

          <input
            name='address1'
            className={`${inputStyle} w-100`}
            type='text'
            placeholder='Enter Address'
            required
          />
          {address}
          <button onClick={handleAddress} className={submitStyles.button}>
            Add more
          </button>
          <hr className='my-5' />

          {/* MINT PRICE PART START */}

          <h2 className={submitStyles.subTitle}>set mint price</h2>

          <div className='d-flex justify-content-between align-items-center'>
            <h2 className={submitStyles.subTitle}>MINT START</h2>
            <div className='d-flex'>
              <DatePicker name='minStarDate' className={submitStyles.mintText}
                          selected={minDate}
                          onChange={(date:any) => setMinDate(date)}
                          dateFormat='MMMM d, yyyy'
              />
              <input
                name='mint_start_time'
                className={submitStyles.timePicker}
                type='time'
                value={minTime}
                onChange={handleMinTimeChange}
                step='600' // this sets the step to 10 minutes (600 seconds)
              />

            </div>
          </div>
          <div className='d-flex justify-content-between align-items-center'>
            <h2 className={submitStyles.subTitle}>MINT EXPIRY</h2>
            <div className='d-flex'>

              <DatePicker name='max_start_date' className={submitStyles.mintText}
                          selected={maxDate}
                          onChange={(date:any) => setMaxDate(date)}
                          dateFormat='MMMM d, yyyy'
              />
              <input
                name='max_start_time'
                className={submitStyles.timePicker}
                type='time'
                value={maxTime}
                onChange={handleMaxTimeChange}
                step='600' // this sets the step to 10 minutes (600 seconds)
              />
            </div>
          </div>

          <div className='d-flex '>
            <FaRegDotCircle className='fs-3 text-primary me-3' />
            <p className='d-flex align-items-center pt-1 fw-bold'>
              Never Expire
            </p>
          </div>

          <div className='d-flex justify-content-between align-items-center'>
            <h2 className={submitStyles.subTitle}>ON SALE END</h2>
            <div className='d-flex'>
              <p className={submitStyles.mintText}>Collection token Burn</p>
              <p className={submitStyles.mintText}>Collection token Return</p>
            </div>
          </div>
        </div>
        <div className={` ${uploadStyles.button} d-flex justify-content-center`}>
          <button type='submit' className={submitStyles.nextButton}>NEXT</button>
        </div>
      </form>
    </section>
  );
};

export default Submit;
