import React from 'react';

export default const titleBox = ({ start }) => {
  return(
    <div>
      <input type="text" class="datepicker" defaultDate={start}>
      <input type="text" class="timepicker" defaultTime='now'>
    </div>
  )
}