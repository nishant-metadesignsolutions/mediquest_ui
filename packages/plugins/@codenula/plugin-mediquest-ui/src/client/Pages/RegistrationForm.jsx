import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { COLLECTION_AUTH_TOKEN } from '../../myvars.js';
import { DynamicForm } from '../Components/DynamicForm.jsx';

import './RegistrationForm.css';

export const RegistrationForm = () => {
  const { eventId } = useParams();
  const [data, setData] = useState({ data: [] });

  useEffect(() => {
    async function fetchData() {
      try {
        const collectionURL = `https://mediquest.codenula.com/api/acc_reg_form:list?pageSize=1000`;
        const formData = await fetch(collectionURL, {
          method: 'GET',
          headers: {
            Authorization: COLLECTION_AUTH_TOKEN,
          },
        });

        const jsonData = await formData.json();
        const eventForm = jsonData.data.filter((item) => item.eventId === parseInt(eventId));
        setData(eventForm[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [eventId]);
  // const renderInputField = (item) => {
  //   if (item.uiSchema && item.uiSchema.enum) {
  //     if (item.name === 'areas_of_interest') {
  //       return (
  //         <div>
  //           {item.uiSchema.enum.map((enumItem) => (
  //             <label key={enumItem.value}>
  //               <input type="checkbox" value={enumItem.value} />
  //               {enumItem.label}
  //             </label>
  //           ))}
  //         </div>
  //       );
  //     } else {
  //       return (
  //         <select>
  //           {item.uiSchema.enum.map((enumItem) => (
  //             <option key={enumItem.value} value={enumItem.value}>
  //               {enumItem.label}
  //             </option>
  //           ))}
  //         </select>
  //       );
  //     }
  //   } else if (item.type === 'belongsTo') {
  //     return;
  //   } else {
  //     return <input type="text" />;
  //   }
  // };

  return (
    <div>
      <DynamicForm formData={data} />
    </div>
  );
};
