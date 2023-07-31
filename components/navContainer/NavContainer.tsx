/*global ergo*/
import React, { useState } from 'react';
import TopNavbar from '../MenuBar/TopNavbar';
import MintModal from '../MintModal/MintModal';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NavContainer = () => {
  const [showModal, setShowModal] = useState(false);
  const [parameters, setParams] = useState([]);
  const [uniqueHash, setUniqueHash] = useState([]);
  const [ergoPay, setErgoPay] = useState(false);
  const [isDisabled, setDisabled] = useState(false);

  let refHash = 'initial';

  const setRefHash = (hash: any) => {
    setUniqueHash(hash);
    refHash = hash;
  };

  return (
    <div className="main-container">
      <ToastContainer />
      {/* <MenuBar /> */}
      <TopNavbar ergopay={[ergoPay, setErgoPay]} />
      {/* banner Img section*/}
      {/* mint modal component */}
      <MintModal
        modalProps={[showModal, setShowModal]}
        hashProps={uniqueHash}
        paramProps={[parameters, setParams]}
      />
    </div>
  );
};

export default NavContainer;
