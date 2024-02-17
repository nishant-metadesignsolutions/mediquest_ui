import { useEffect, useState } from 'react';
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
  return (
    <div>
      <DynamicForm formData={data} />
    </div>
  );
};
