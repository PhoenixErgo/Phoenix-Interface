import React, { useEffect } from 'react';
import Slider from '@mui/material/Slider';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const RoyalitySlider = ({
                          showClose,
                          id,
                          item,
                          formValue,
                          royalty,
                          setRoyalty,
                          addressVerify,
                          setAddressVerify,
                        }:any) => {
  // Load the form data from local storage on component mount

  useEffect(() => {
    if (royalty[0].address) {
      setAddressVerify(true);
    }
  }, [royalty]);

  const verifyAddress = (address:any) => {
    if (address) setAddressVerify(true);
    else setAddressVerify(false);
  };
  const handleDeleteAddressInputSlider = (index:any) => {
    const royality = [...royalty];
    // const index = royality.indexOf(item);
    if (index > -1) {
      royality.splice(index, 1);
    }
    setRoyalty(royality);
    formValue.royality = royality;
  };


  const handleRoyalitiChange = (e:any, index:any) => {
    const { name, value } = e.target;
    const royality = [...royalty];
    const updatedRoyality = royality.map((royaliti, i) => {
      if (index === i) {
        return { ...royaliti, [name]: value };
      }
      return royaliti;
    });
    setRoyalty(updatedRoyality);
    formValue.royality = updatedRoyality;
    verifyAddress(value);
  };

  return (
    <div>
      {/*range text*/}
      <div>
        <div
          className='d-flex justify-content-between align-items-center mt-5'
          style={{
            fontWeight: 600,
            fontSize: 18,
            fontFamily: `'Inter', sans-serif`,
          }}
        >
          <p>Amount</p>
          <p>{item?.amount}%</p>
        </div>
        {/*range slider*/}
        <div className='d-flex align-items-center'>
          <span className='mr-3 text-warning'>0%</span>
          <Slider
            defaultValue={item?.amount}
            aria-label='Default'
            name={`amount`}
            valueLabelDisplay='auto'
            min={0}
            max={10}
            style={{ color: 'white' }}
            onChange={(e) => handleRoyalitiChange(e, id)}
          />
          <span className='ml-3 text-warning'>10%</span>
        </div>
      </div>

      <div style={{ position: 'relative', fontFamily: `'Inter', sans-serif` }}>
        {showClose ? (
          <div
            className='d-flex justify-content-end'
            style={{
              top: '-10px',
              right: '-10px',
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
                onClick={() => handleDeleteAddressInputSlider(id)}
              />
            </span>
          </div>
        ) : null}

        <div className='relative rounded border border-solid border-white mt-10 '>
          <input
            type='text'
            id={`EnterAddress${id}`}
            name={`address`}
            defaultValue={item?.address ?? ''}
            onChange={(e) => handleRoyalitiChange(e, id)}
            className='block rounded  px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none text-white border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
            placeholder=' '
          />
          <label
            htmlFor={`EnterAddress${id}`}
            className='absolute text-sm text-white-500 text-white-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-white-600 peer-focus:text-white-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4'
          >
            Enter Address
          </label>
        </div>
      </div>
    </div>
  );
};

export default RoyalitySlider;
