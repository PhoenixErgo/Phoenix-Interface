import  { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { Button } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';

const ErgoPayWalletModal = ({
  setIsModalOpen,
  connectErgoPay,
  ergoPay,
  setErgoPay,
  activeKey,
}: any) => {
  const [parameters, setParams] = useState<any>([]);
  const [uniqueHash, setUniqueHash] = useState([]);
  const [textToCopy, setTextToCopy] = useState<string>('');

  let refHash = 'initial';
  const toaster_copy_text: any = {
    position: 'bottom-right',
    toastId: 'Address copy',
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    theme: 'dark',
  };

  const setRefHash = (hash: any) => {
    setUniqueHash(hash);
    refHash = hash;
  };
  const generatedQRCode = `ergopay://ergopay.ergosapiens.com/ergopay/${parameters.address}/#P2PK_ADDRESS#/${parameters.amount}/${refHash}`;

  useEffect(() => {
    setTextToCopy(generatedQRCode);
  }, [generatedQRCode]);

  const handleCopyText = (e: any) => {
    toast.success('Address successfully copied!', toaster_copy_text);
  };

  const openLink = () => {
    (window as any).open(
      `ergopay://ergopay.ergosapiens.com/ergopay/${parameters.address}/#P2PK_ADDRESS#/${parameters.amount}/${refHash}`,
    );
  };

  return (
    <div style={{ fontFamily: `'Space Grotesk', sans-serif` }}>
      <p>
        Complete the action with an ErgoPay compatible wallet.
      </p>
      <div className="text-center mt-1 mb-4">
        <a
          href="https://ergoplatform.com"
          style={{ color: '#6E64BF', textDecoration: 'none' }}
          target="_blank"
          rel="noreferrer"
        >
          Find an ErgoPay compatible wallet
        </a>
      </div>

      <h6 className="text-center text-white">Scan QR code</h6>

      {/*  qr code*/}
      <div className="flex justify-center">
        <div
          style={{
            background: 'white',
            padding: '10px',
            maxWidth: 290,
            borderRadius: 10,
          }}
        >
          {refHash ? (
            <QRCode
              size={150}
              value={`ergopay://ergopay.ergosapiens.com/ergopay/${parameters.address}/#P2PK_ADDRESS#/${parameters.amount}/${refHash}`}
            />
          ) : null}
        </div>
      </div>
      <div>
        <h6 className="text-white text-center mt-2">or</h6>
      </div>

      <div className="flex justify-center mt-4">
        <CopyToClipboard text={textToCopy} onCopy={(e) => handleCopyText(e)}>
          <Button
            block
            style={{
              fontFamily: `'Space Grotesk', sans-serif`,
            }}
            onClick={() => setIsModalOpen(false)}
            className="mr-2"
          >
            Copy request
          </Button>
        </CopyToClipboard>

        <Button
          block
          style={{
            border: 'none',
            color: 'white',
            background: '#6F65C5',
            fontFamily: `'Space Grotesk', sans-serif`,
          }}
          onClick={openLink}
          className="ml-2"
        >
          Open wallet
        </Button>
      </div>
    </div>
  );
};

export default ErgoPayWalletModal;
