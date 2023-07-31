import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import uploadStyles from '../../styles/Upload.module.css';
import submitStyles from '../../styles/Submit.module.css';
import Image from 'next/image';
import Link from 'next/link';
import navStyle from '../../styles/navbar.module.css';
import uploadCloud from '../../assest/images/llium-assets/upload_cloud_icon.svg';


const thumbsContainer: React.CSSProperties= {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 10,
};

const thumb : React.CSSProperties= {
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

const thumbInner : React.CSSProperties= {
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

const Previews = (props:any) => {
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: (acceptedFiles:any) => {
      setFiles(
        acceptedFiles.map((file:any) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      );
    },
  });

  const thumbs = files.map((file:any) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <Image
          src={file.preview}
          alt='uploaded file'
          width={300}
          height={200}
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file:any) => URL.revokeObjectURL(file.preview));
  }, []);
  console.log('uploaded file:', thumbs);
  return (
    <div>
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
          Upload the metadata file containing the standard specified
          <a href='https://github.com/LiliumErgo/lilium-artist-guide#uploading-metadata'>here</a>
        </p>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />

          {thumbs.length ? (
            <div className={`${uploadStyles.previewFileBox}`}>
              <aside style={thumbsContainer}>{thumbs}</aside>
            </div>
          ) : (
            <div className={`${uploadStyles.addFileBox}`}>
              <div className='flex flex-col items-center justify-center  '>
                <Image src={uploadCloud} alt='u' />
              </div>
              <p className='text-center text-warning '>
                Drag and drop any files <br /> here, or click below to <br />{' '}
                browse.
              </p>
              <button className='bg-white hover:bg-white-700 text-black font-bold py-2 px-4 rounded-2xl'>
                Add files
              </button>
            </div>
          )}
        </div>

        <p className={submitStyles.fileType}>File type: Json</p>
      </section>
      <div className={`d-flex justify-content-center`}>
        <div className={` d-flex justify-content-center`}>
          <Link href='/payment' className={navStyle.navLinks}>
            <button type='submit' className={submitStyles.nextButton}>
              NEXT
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Previews;
