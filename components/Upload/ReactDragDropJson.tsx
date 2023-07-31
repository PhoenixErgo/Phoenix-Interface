import React, { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import uploadStyles from '../../styles/Upload.module.css';
import submitStyles from '../../styles/Submit.module.css';
import Image from 'next/image';
import navStyle from '../../styles/navbar.module.css';
import { toast } from 'react-toastify';
import { noti_option, noti_option_close } from '../Notifications/Toast';
import jsonImg from '../../public/json.svg';
import { useRouter } from 'next/router';
import { NFTStorage } from 'nft.storage';
import Link from 'next/link';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 10,
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  // border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 350,
  height: 220,
  padding: 4,
  boxSizing: 'border-box',
  justifyContent: 'center',
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
  alignItems: 'center',
};
//
// const img = {
//   display: 'block',
//   width: 'auto',
//   height: '100%',
// };

function isValidJson(json: any) {
  if (!json) return false;

  const hasStringProperties = (obj: any, props: any) =>
    props.every((prop: any) => typeof obj[prop] === 'string');
  const verifyAssetType = (obj: any) => {
    if(obj.hasOwnProperty('assetType')){
      const validValues = ["picture", "audio", "video", "attachment", "membership"];
      return typeof obj.assetType === 'string' && validValues.includes(obj.assetType);
    }
    return false;
  }
  const isAttributesValid = (attr: any) =>
    Array.isArray(attr) &&
    attr.every((item) => hasStringProperties(item, ['trait_type', 'value']));
  const isLevelsStatsValid = (data: any) =>
    Array.isArray(data) &&
    data.every((item) =>
      hasStringProperties(item, ['trait_type', 'max_value', 'value']),
    );

  return (
    hasStringProperties(json, [
      'name',
      'description',
      'image',
      'imageSHA256',
      'assetType',
    ]) &&
    typeof json.explicit === 'boolean' &&
    verifyAssetType(json) &&
    isAttributesValid(json.attributes) &&
    isLevelsStatsValid(json.levels) &&
    isLevelsStatsValid(json.stats)
  );
}

const PreviewsJson = (props: any) => {
  const acceptedFileTypes = ['.json'];
  const [jsonData, setJsonData] = useState(null);

  // Load the form data from local storage on component mount
  useEffect(() => {
    const storedMetadataUpload = localStorage.getItem('metadataUpload');
    if (storedMetadataUpload) {
      const localDataMetadataUpload = JSON.parse(storedMetadataUpload);
      setJsonData(localDataMetadataUpload);
    }
  }, []);

  const handleDrop = (acceptedFiles: any) => {
    // Check if any files were dropped
    if (acceptedFiles.length === 0) {
      toast.warn('No files dropped!', noti_option_close('try-again'));
      return;
    }

    // Check that only one file was dropped
    if (acceptedFiles.length > 1) {
      toast.warn('Please drop only one file', noti_option_close('try-again'));
      return;
    }

    // Check that the dropped file is a JSON file
    const droppedFile = acceptedFiles[0];
    if (!droppedFile.type.includes('json')) {
      toast.warn('Please drop a JSON file', noti_option_close('try-again'));
      return;
    }
    async function storeJsonMetadata(json: any) {
      const NFT_STORAGE_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_KEY;
      // @ts-ignore
      const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });
      const file = new Blob([JSON.stringify(json)], {
        type: 'application/json',
      });
      return await nftstorage.storeBlob(file);
    }

    // Read the dropped file and extract the JSON data
    const reader = new FileReader();
    reader.onload = async () => {
      const fileContent: any = reader.result;
      const jsonData = JSON.parse(fileContent);
      localStorage.setItem('ipfs', 'false');
      try {
        if (jsonData.every((item: any) => isValidJson(item))) {
          setJsonData(jsonData);
          localStorage.setItem('metadataUpload', fileContent);
          toast.success(
            'Metadata Uploaded',
            noti_option_close('upload-success'),
          );
          console.log(jsonData);
        } else {
          toast.warn(
            'File does not follow metadata standard',
            noti_option_close('try-again'),
          );
        }
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === 'QuotaExceededError'
        ) {
          console.log('Local storage quota exceeded');
          const ipfsNoti = toast.loading(
            'File size large, uploading to IPFS',
            noti_option,
          );
          try {
            const ipfsHash = await storeJsonMetadata(jsonData);
            const ipfsLink = `https://nftstorage.link/ipfs/${ipfsHash}`;
            localStorage.setItem('ipfsUpload', ipfsLink);
            localStorage.setItem('ipfs', 'true');
          } catch (error) {
            toast.dismiss();
            console.log('ipfs error:', error);
            toast.warn('ipfs error', noti_option_close('try-again'));
          }

          toast.update(ipfsNoti, {
            render: 'Uploaded',
            type: 'success',
            isLoading: false,
            // @ts-ignore
            autoClose: true,
          });
        } else {
          toast.warn(
            'File may not follow metadata standard',
            noti_option_close('try-again'),
          );
        }
      }
    };
    reader.readAsText(droppedFile);
  };
  const { push } = useRouter();
  const handleNextButton = () => {
    if (jsonData) {
      push('/payment');
    } else {
      push('#');
    }
  };

  return (
    <div>
      {/* <div>
      <Dropzone onDrop={handleDrop} accept="application/json">
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drop a JSON file here, or click to select a file</p>
          </div>
        )}
      </Dropzone>
      {jsonData && (
        <div>
          <p>JSON data:</p>
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      )}
    </div> */}
      <section className={`${uploadStyles.uploadContainer}`}>
        <h1 className={submitStyles.title}>UPLOAD FILE</h1>
        <hr
          style={{
            marginTop: 30,
            color: '#E0E0E0',
          }}
        />
        <p
          style={{
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: 16,
            marginTop: 53,
            marginBottom: 61,
          }}
        >
          Upload the metadata file containing the standard specified{' '}
          <a href="https://github.com/LiliumErgo/lilium-artist-guide#uploading-metadata">
            here
          </a>
        </p>
        <Dropzone onDrop={handleDrop}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {jsonData ? (
                <div className={`${uploadStyles.addFileBox}`}>
                  <div className="flex flex-col items-center justify-center  ">
                    <Image src={jsonImg} alt="" width={140} />
                  </div>
                </div>
              ) : (
                <div className={`${uploadStyles.addFileBox}`}>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-center text-warning ">
                      Drag and drop any files <br /> here, or click below to{' '}
                      <br />
                      browse.
                    </p>
                    <button className="bg-white hover:bg-white-700 text-black font-bold py-2 px-4 rounded-2xl">
                      Add files
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Dropzone>

        <p className={submitStyles.fileType}>File type: Json</p>
      </section>

      <div className={`d-flex justify-content-center`}>
        <Link
          href="/create-collection"
          className={` d-flex justify-content-center mr-2 no-underline`}
        >
          <button
            className={`${submitStyles.nextButton} ${navStyle.navLinks} `}
          >
            Back
          </button>
        </Link>

        <div className={` d-flex justify-content-center ml-2`}>
          <button
            onClick={handleNextButton}
            type="submit"
            className={`${submitStyles.nextButton} ${navStyle.navLinks}`}
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
};
export default PreviewsJson;
