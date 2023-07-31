import React from 'react';
import ProgressBarStyles from '../../styles/ProgressBar.module.css';

const ProgressBar = ({ setProgress, progress }:any) => {


  const handleClick = () => {
    if (progress < 100) {
      setProgress(progress + 20);
    }
  };
  return (
    <div>
      <div className={ProgressBarStyles.progressBar}>
        <div className={ProgressBarStyles.progress} style={{ width: `${progress}` }}>


          <button className={ProgressBarStyles.btn} onClick={handleClick}>
            {progress === 100 ? 'Done!' : '..'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;