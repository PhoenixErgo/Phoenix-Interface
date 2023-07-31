import React from 'react';
import submitStyles from '../../styles/Submit.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { generateKey } from './CreateCollection';

const id = 0;

const Social = ({ formValue }:any) => {
  const [social, setSocial] = React.useState(formValue?.socialData);
  const handleDeleteSocialInput = (index:any) => {
    const socialInput = [...social];
    // const index = socialInput.indexOf(item);
    if (index > -1) {
      socialInput.splice(index, 1);
    }
    setSocial(socialInput);
    formValue.socialData = socialInput;
  };

  const handleSocialsChange = (e:any, index:any) => {
    const { name, value } = e.target;
    const socialValue = [...social];
    const updatedSocials = socialValue.map((social, i) => {
      if (index === i) {
        return { ...social, [name]: value };
      }
      return social;
    });
    setSocial(updatedSocials);
    formValue.socialData = updatedSocials;
  };

  const handleAddSocialField = () => {
    const socialInput = [...social];
    let newSocialInput;
    if (socialInput) {
      newSocialInput = [
        ...socialInput,
        { socialName: '', socialAddress: '', _id: generateKey('social__') },
      ];
    }
    setSocial(newSocialInput);
    formValue.socialData = newSocialInput;
  };

  React.useEffect(() => {
    setSocial(formValue?.socialData);
  }, [formValue]);
  return (
    <div>
      <h2 className={submitStyles.subTitle}>Socials</h2>
      <div className='row' style={{ fontFamily: `'Inter', sans-serif` }}>
        <div className='col-12 col-md-4'>
          <div className='relative rounded border border-solid border-white'>
            <input
              type='text'
              id='socialName_1'
              name='socialName'
              defaultValue={social ? social[0].socialName : ''}
              onChange={(e) => handleSocialsChange(e, 0)}
              className='block rounded  px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none text-white border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=' '
            />
            <label
              htmlFor='socialName_1'
              className='absolute text-sm text-white-500 text-white-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-white-600 peer-focus:text-white-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4'
            >
              Enter social name ex: Twitter
            </label>
          </div>
        </div>
        <div className='col-12 col-md-8'>
          <div className='relative rounded border border-solid border-white'>
            <input
              type='text'
              id='socialLink_1'
              name='socialAddress'
              defaultValue={social ? social[0].socialAddress : ''}
              onChange={(e) => handleSocialsChange(e, 0)}
              className='block rounded  px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none text-white border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=' '
            />
            <label
              htmlFor='socialLink_1'
              className='absolute text-sm text-white-500 text-white-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-white-600 peer-focus:text-white-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4'
            >
              Enter Corresponding Link
            </label>
          </div>
        </div>
      </div>
      {social.length > 1 &&
        social.map((item:any, index:any) => {
          if (index !== 0) {
            return (
              <div
                className='row'
                key={item?._id}
                style={{
                  position: 'relative',
                  fontFamily: `'Inter', sans-serif`,
                }}
              >
                <div
                  className='d-flex justify-content-end'
                  style={{
                    top: '20px',
                    left: '10px',
                    position: 'absolute',
                    zIndex: 100,
                  }}
                >
                  <span
                    style={{
                      background: '#1A1B22',
                      borderRadius: '50%',
                      cursor: 'pointer',
                    }}
                  >
                    <HighlightOffIcon
                      onClick={() => handleDeleteSocialInput(index)}
                    />
                  </span>
                </div>
                <div className='col-12 col-md-4'>
                  <div className='relative rounded border border-solid border-white mt-8'>
                    <input
                      type='text'
                      id={`socialName_${item}`}
                      name='socialName'
                      defaultValue={item?.socialName}
                      onChange={(e) => handleSocialsChange(e, index)}
                      className='block rounded  px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none text-white border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                      placeholder=' '
                    />
                    <label
                      htmlFor={`socialName_${item}`}
                      className='absolute text-sm text-white-500 text-white-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-white-600 peer-focus:text-white-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4'
                    >
                      Enter social name ex: Twitter
                    </label>
                  </div>
                </div>
                <div className='col-12 col-md-8'>
                  <div className='relative rounded border border-solid border-white mt-8'>
                    <input
                      type='text'
                      id={`socialLink_${item}`}
                      defaultValue={item?.socialAddress}
                      onChange={(e) => handleSocialsChange(e, index)}
                      name='socialAddress'
                      className='block rounded  px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none text-white border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                      placeholder=' '
                    />
                    <label
                      htmlFor={`socialLink_${item}`}
                      className='absolute text-sm text-white-500 text-white-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-white-600 peer-focus:text-white-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4'
                    >
                      Enter Corresponding Link
                    </label>
                  </div>
                </div>
              </div>
            );
          }
        })}
      <button onClick={handleAddSocialField} className={submitStyles.button}>
        Add More
      </button>
      <hr className='my-5' />
    </div>
  );
};
export default Social;
