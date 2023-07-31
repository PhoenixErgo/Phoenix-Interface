import React from 'react';
import submitStyles from '../../styles/Submit.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import RoyalitySlider from './RoyalitySlider';
import { generateKey } from './CreateCollection';

const Royality = ({ formValue, addressVerify, setAddressVerify }:any) => {
  const [royalty, setRoyalty] = React.useState(formValue?.royality);
  const handleAddRoyalitiField = () => {
    const royaliti = [...royalty];
    let newRoyaliti;
    if (royaliti) {
      newRoyaliti = [
        ...royaliti,
        { address: '', amount: 0, _id: generateKey('slider__') },
      ];
    }
    setRoyalty(newRoyaliti);
    formValue.royality = newRoyaliti;
  };


  React.useEffect(() => {
    setRoyalty(formValue?.royality);
  }, [formValue]);
  return (
    <div>
      <h2 className={submitStyles.subTitle}>ROYALTIES</h2>

      <p className={submitStyles.text}>
        Every time an NFT gets sold, the original owner receives a percentage of
        the sale <br /> price. You can set the amount here, and the payments
        will execute automatically.
      </p>

      {royalty?.map((item:any, index:any) => (
        <div key={item._id}>
          <RoyalitySlider
            id={index}
            showClose={index < 1 ? false : true}
            item={item}
            formValue={formValue}
            royalty={royalty}
            setRoyalty={setRoyalty}
            addressVerify={addressVerify}
            setAddressVerify={setAddressVerify}
          />
        </div>
      ))}

      <button onClick={handleAddRoyalitiField} className={submitStyles.button}>
        Add More
      </button>
    </div>
  );
};

export default Royality;
