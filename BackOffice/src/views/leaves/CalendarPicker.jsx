import React from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const CalendarPicker = ({ startDate, endDate, onChange }) => {
  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: 'selection',
  };

  return (
    <DateRangePicker
      ranges={[selectionRange]}
      onChange={onChange}
      months={2}
      direction="horizontal"
      minDate={new Date()}
      rangeColors={['#3f51b5']}
      showMonthAndYearPickers={false}
    />
  );
};

export default CalendarPicker;