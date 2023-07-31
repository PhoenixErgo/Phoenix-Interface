import React from 'react';
import styles from '../../styles/navbar.module.css';
import Image from 'next/image';
import shield from '../../assest/images/llium-assets/shield-blue.svg';
import bolt from '../../assest/images/llium-assets/bolt.svg';
import laptop from '../../assest/images/llium-assets/purpleDude.svg';

const SellBanner = () => {
  return (
    <div className={styles.sellBanner}>
      <div>
        <h1 className={styles.sellBannerHeader}>
          SELL NFTS THE WAY
          <br /> YOU WANT
        </h1>
      </div>
      <div className='d-flex justify-content-center align-items-center'>
        <div className=''>
          <span className={styles.sellBannerHeading}>NFT SALE PLATFORM</span>
          <h2 className={styles.sellBannerHeaderText}>
            We do the tech, so you
            <br /> can focus on the <br /> quality of your content
          </h2>
          <div className='d-flex justify-content-start' style={{ fontFamily: `'Inter', sans-serif` }}>
            <div style={{ marginRight: '29px' }}>
              <Image src={shield} alt='' />
              <p style={{ paddingTop: '30px' }}>Protected by smart contracts</p>
              <p style={{ color: '#C2C3C5' }}>Powered by Ergo Blockchain</p>
            </div>
            <div>
              <Image src={bolt} alt='' />
              <p style={{ paddingTop: '30px' }} className='text-light'>
                Hassle Free
              </p>
              <p style={{ color: '#C2C3C5' }}>Get setup in a few clicks</p>
            </div>
          </div>
        </div>
        <div className='mx-12'>
          <Image
            className='img-fluid'
            style={{ paddingTop: '64px' }}
            src={laptop}
            alt='man'
            width={653}
          />
        </div>
      </div>
    </div>
  );
};

export default SellBanner;
