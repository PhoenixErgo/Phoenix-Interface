import 'flatpickr/dist/themes/material_blue.css';
import Flatpickr from 'react-flatpickr';
import submitStyles from '../../styles/Submit.module.css';
import { FormContext } from '../../pages/_app';
import { useContext } from 'react';
import { Tooltip } from 'antd';
import moment from 'moment';
import { addTimeZone, convertToIsoStringIgnoringTimezone } from '../../blockchain/ergo/api';
import { toDate, format, formatInTimeZone } from 'date-fns-tz'
import { enGB } from 'date-fns/locale';

const FlatpickerMin = () => {
  // @ts-ignore
  const { minDateTime, setMinDateTime } = useContext(FormContext);

  return (
    <Tooltip placement="topLeft" title={'UTC Timezone'}>
      <Flatpickr
        options={{ minDate: 'today', defaultDate: minDateTime }}
        data-enable-time
        value={addTimeZone(minDateTime.utc().format('YYYY-MM-DDTHH:mm:ss'))}
        onChange={([selectedDate]) => {
          const date = moment(convertToIsoStringIgnoringTimezone(selectedDate));
          setMinDateTime(date);
        }}
        className={submitStyles.mintText}
      />
    </Tooltip>
  );
};

export default FlatpickerMin;
