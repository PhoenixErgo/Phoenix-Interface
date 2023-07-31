import 'flatpickr/dist/themes/material_blue.css';
import Flatpickr from 'react-flatpickr';
import submitStyles from '../../styles/Submit.module.css';
import { FormContext } from '../../pages/_app';
import { useContext } from 'react';
import { Tooltip } from 'antd';
import moment from 'moment';
import { addTimeZone, convertToIsoStringIgnoringTimezone } from '../../blockchain/ergo/api';

const FlatpickerMax = () => {
  // @ts-ignore
  const { maxDateTime, setMaxDateTime } = useContext(FormContext);

  return (
    <Tooltip placement="topLeft" title={'UTC Timezone'}>
      <Flatpickr
        options={{ minDate: 'today', defaultDate: maxDateTime }}
        data-enable-time
        value={addTimeZone(maxDateTime.utc().format('YYYY-MM-DDTHH:mm:ss'))}
        onChange={([selectedDate]) => {
          const date = moment(convertToIsoStringIgnoringTimezone(selectedDate));
          setMaxDateTime(date);
        }}
        className={submitStyles.mintText}
      />
    </Tooltip>
  );
};

export default FlatpickerMax;
