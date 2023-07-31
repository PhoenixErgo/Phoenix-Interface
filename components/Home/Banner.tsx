import React from 'react';
import styles from '../../styles/navbar.module.css';
import Image from 'next/image';
import Frame from '../../assest/images/llium-assets/Header-SVG.svg';
import Link from 'next/link';

const Banner = () => {
  return (
    <div className={styles.banner}>
      <div className='row d-flex justify-content-center'>
        <div className='col-md-6'>
          <h1 className={styles.bannerHeaderText}>
            THE BEST
            <br /> COMMUNITY
            <br /> CENTRIC NFT
            <br /> <span className={styles.colorText}>SALE PLATFORM</span>
          </h1>

          <p className={styles.bannerText}>
            LILIUM is a next-generation smart contract platform to mint and launch NFT collections effortlessly
          </p>
          <Link href='/create-collection' className={styles.navLinks}>
            <button className='bg-createButton hover:bg-createButton text-white font-bold rounded-xl mt-5'
                    style={{ background: '#E041E7', padding: '18px 32px' }}>
              CREATE COLLECTION
            </button>
          </Link>
        </div>
        <div className='col-md-6'>
          <div className='d-flex justify-content-end pr-12'>
            <Image className='img-fluid' src={Frame} alt='circle' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
