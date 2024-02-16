import React from 'react';
import '../assets2/css/main.min.css';
import '../assets2/css/external.css';
import './StyledText.css';

const StyledText = ({ htmlContent, className }) => {
  const combinedClassName = className ? `styled-text ${className}` : 'styled-text';
  return <div className={combinedClassName} dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default StyledText;
