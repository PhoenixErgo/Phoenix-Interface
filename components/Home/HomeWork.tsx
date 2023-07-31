import React from 'react';
import Image from 'next/image';
import styles from '../../styles/navbar.module.css';
import Diagram from '../../assest/images/llium-assets/Diagram.svg';

const HomeWork = () => {
  return (
    <div className='text-center mt-5 pt-5'>
      <h2 className={styles.homeWorkText}>HOW IT WORKS</h2>
      <div className='col-md-12 pl-12 d-flex justify-content-center'>
        <Image className='img-fluid' src={Diagram} alt='working flow' />
      </div>
    </div>
  );
};

export default HomeWork;
