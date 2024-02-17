import { useState } from 'react';
import Loader from './Loader.jsx';
import '../assets2/css/main.min.css';
import '../assets2/css/external.css';
import StyledText from './StyledText.jsx';

export const Popup = ({ formValues, onClose, onVerifiedAndSubmit, formDesign, formData, important_note, event }) => {
  const [loading, setLoading] = useState(false);
  const labelStyle = {
    fontWeight: 'bold',
    marginRight: '8px', // Adjust margin as needed
  };

  const mapFieldNameToLabel = (fieldName) => {
    switch (fieldName) {
      case 'paymentId':
        return 'Payment Category';
      case 'discountCouponId':
        return 'Discount Coupon';
      case 'stateId':
        return 'State';
      case 'cityId':
        return 'City';
      case 'countryId':
        return 'Country';
      // Add more cases as needed
      default:
        return fieldName;
    }
  };

  return (
    <div className="popup">
      {loading && <Loader />}
      {!loading && (
        <section className="form-box">
          <div className="container">
            <h2>{event.verification_instruction}</h2>
            {formDesign.map((row, rowIndex) => (
              <div key={rowIndex} className={`form-row ${row.style}`}>
                {row.fields.map((eachField, fieldIndex) => {
                  const fieldValue = formData[eachField];
                  if (fieldValue !== undefined && fieldValue !== '' && fieldValue !== null) {
                    return (
                      <>
                        <div className="form-col">
                          <div key={rowIndex} className="form-group">
                            <span style={labelStyle}>
                              {mapFieldNameToLabel(eachField).toUpperCase().replace(/_/g, ' ')}:
                            </span>
                            <div className="textbox-inner">
                              <input
                                type="text"
                                className="form-control"
                                value={formValues[eachField] || '- -'}
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  }
                  return null;
                })}
              </div>
            ))}
            <div className="registration-btns regist-btns2">
              <button className="btn btn-yellow btn-lg" onClick={onClose}>
                EDIT FORM
              </button>
              <button className="btn btn-yellow btn-lg" onClick={onVerifiedAndSubmit}>
                CONFIRM & PROCEED TO PAY
              </button>
            </div>
            <div className="important-notes-list">
              <StyledText htmlContent={event.important_note} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
