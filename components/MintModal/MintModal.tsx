/*global ergo*/
import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// import './MintModal.css';
import QRCode from 'react-qr-code';

const MintModal: React.FC<any> = (props: any) => {
  const [showModal, setShowModal] = props.modalProps;
  let modalStatus = true;

  const handleClose = () => {
    setShowModal(false);
    modalStatus = false;
  };

  const openLink = () => {
    window.open(
      `ergopay://ergopay.ergosapiens.com/ergopay/${parameters.address}/#P2PK_ADDRESS#/${parameters.amount}/${refHash}`,
    );
  };

  const refHash = props.hashProps;
  const [parameters, setParams] = props.paramProps;

  return (
    <>
      <Modal
        className="mint"
        centered
        aria-labelledby="contained-modal-title-vcenter"
        show={showModal}
        onHide={handleClose}
      >
        <Modal.Header>
          <Modal.Title>ErgoPay</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ background: 'white', padding: '16px' }}>
            {refHash ? (
              <QRCode
                value={`ergopay://ergopay.ergosapiens.com/ergopay/${parameters.address}/#P2PK_ADDRESS#/${parameters.amount}/${refHash}`}
              />
            ) : null}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={openLink}>
            Open with wallet
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MintModal;
