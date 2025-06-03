import React from 'react';
import './EmptyData.scss';

const EmptyData: React.FC = () => {
  return (
    <div className='empty-state'>
      <div className='icon'>📂</div>
      <p>Danh sách trống</p>
    </div>
  );
};

export default EmptyData;
