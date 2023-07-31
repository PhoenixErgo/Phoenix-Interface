import React from 'react';
import Banner from '../../assest/images/image 21.png';
import Image from 'next/image';

const HomeLastPart = () => {
  return (
    <div className=''>
      <Image className='img-fluid w-100' src={Banner} alt='banner' />
    </div>
  );
};

export default HomeLastPart;
