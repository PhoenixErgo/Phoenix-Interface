import React from 'react';
import SideBar from '../Common/SideBar';
import PreviewsJson from './ReactDragDropJson';

const Upload = () => {
  return (
    <div className='row px-3'>
      <SideBar />
      <div className={`col-12 col-md-7`}>
        <PreviewsJson />
      </div>
    </div>
  );
};

export default Upload;
