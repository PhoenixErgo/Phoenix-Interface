import React from 'react';
import ALPH from '../../public/alephium_logo_dark.png';
import Image from 'next/image';

const AlephiumIcon = () => {
  return <Image src={ALPH} alt="logo" width={24} height={24} style={{ color: 'white' }} />;
};

export default AlephiumIcon;
