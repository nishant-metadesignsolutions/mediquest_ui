import React, { useState } from 'react';
import StyledText from '../Components/StyledText';
import Loader from '../Components/Loader';
import '../assets2/css/main.min.css';
import '../assets2/css/external.css';

export const AccordionItem = ({ title, content, pdfLink }) => {
  const [isActive, setIsActive] = useState(false);

  const toggleAccordion = () => {
    setIsActive((prevIsActive) => !prevIsActive);
  };
  return (
    <>
      <div className="accordion-item">
        <button className={`accordion-btn ${isActive ? 'active' : ''}`} onClick={toggleAccordion}>
          <div className="container">
            <span>{title}</span>
          </div>
        </button>
        {isActive && (
          <>
            <div className="panel" style={{ maxHeight: 'inherit' }}>
              <div className="container">
                <div className="pannel-inner">
                  <StyledText htmlContent={content} />
                </div>
              </div>
            </div>
            {pdfLink && (
              <div className="goal-pdfs text-center">
                <iframe
                  src={pdfLink}
                  frameBorder={0}
                  style={{ width: '80%', minHeight: '540px', height: '100%', justifyContent: 'center' }}
                ></iframe>
              </div>
            )}

            {/* <div className="panel">{content}</div> */}
          </>
        )}
      </div>
    </>
  );
};
