import Image from 'next/image';
import React from 'react';
import MGpaiPic from '../../assest/images/llium-assets/MGpai.png';
import lgd from '../../assest/images/llium-assets/lgd.jpg';
import Twitter from '../../assest/images/team/Vector.svg';
import styles from '../../styles/navbar.module.css';
import Link from 'next/link';

const HomeTeam = () => {
  return (
    <div>
      <h1 className={styles.homeTeamHeader}>TEAM</h1>
      <div className='row' style={{ marginTop: 56 }}>
        <div className='col-md-5 m-auto'>
          <div className='d-flex justify-content-between'>
            <div>
              <Image alt='a' style={{ borderRadius: '50%' }} src={MGpaiPic} width={169} height={169}
                     className='m-auto' />
              <h3 style={{
                paddingTop: '12px', paddingBottom: '6px', fontWeight: 800,
                fontSize: '18px',
                lineHeight: '21px',
                textAlign: 'center',
              }}>
                MGpai
              </h3>
              <p style={{ color: ' #5D7789', fontWeight: 600, fontFamily: `'Inter', sans-serif` }}
                 className='text-center'>
                Founder and Backend
              </p>
              <Link href='https://twitter.com/shishirpai'>
              <Image alt='a' className='m-auto' src={Twitter} style={{ cursor: 'pointer' }} />
              </Link>
            </div>

            <div>
              <Image alt='a' style={{ borderRadius: '50%' }} src={lgd} className='m-auto' width={169} height={169} />
              <h3 style={{
                paddingTop: '12px', paddingBottom: '6px', fontWeight: 800,
                fontSize: '18px',
                lineHeight: '21px',
                textAlign: 'center',
              }}>
                LGD
              </h3>
              <p style={{ color: ' #5D7789', fontWeight: 600, fontFamily: `'Inter', sans-serif` }}>
                Founder and Backend
              </p>
                <Link href='https://twitter.com/ldgaetano'>
                  <Image alt='a' className='m-auto' src={Twitter} style={{ cursor: 'pointer' }} />
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTeam;
