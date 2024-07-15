import React from 'react';

const ProgressBar = ({ progress, width, height, color }) => {
  const containerStyles = {
    width: width,
    height: height,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  };

  const fillerStyles = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor: color,
    transition: 'width 0.5s ease-in-out',
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}></div>
    </div>
  );
};

export default ProgressBar;
