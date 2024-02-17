
import { useState, createContext, useContext, useEffect } from 'react';
import { COLLECTION_AUTH_TOKEN } from '../../myvars';
import { getFooter } from '../utils/getData';

// Create a context for your data
const AllEventsDataContext = createContext();

// Custom hook to use the data context
export const useAllEventsData = () => useContext(AllEventsDataContext);

export const EventDetailsProvider = ({ children }) => {
  const [allEvents, setAllEvents] = useState([]); // Set initial state to an empty array
  const [loading, setLoading] = useState(true);
  const [footerDetails, setFooterDetails] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const AllEventsUrl =
          'https://mediquest.codenula.com/api/event:list?pageSize=20&appends%5B%5D=event_banner&appends%5B%5D=venue&appends%5B%5D=faculty&appends%5B%5D=agenda&appends%5B%5D=attendee&appends%5B%5D=createdBy&appends%5B%5D=updatedBy&appends%5B%5D=event_card_image&appends%5B%5D=chairpersons&appends%5B%5D=intl_faculty&filter=%7B%7D';
        const AllEvent = await fetch(AllEventsUrl, {
          method: 'GET',
          headers: {
            Authorization: COLLECTION_AUTH_TOKEN,
          },
        });
        const AllEventDataJSON = await AllEvent.json();
        const AllEventData = AllEventDataJSON.data;
        setAllEvents(AllEventData);
        const footerData = await getFooter();
        setFooterDetails(footerData);
        console.log(AllEventData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setAllEvents([]); // Set allEvents to an empty array on error
        setLoading(false); // Also, stop loading
      }
    })();
  }, []);

  return (
    <AllEventsDataContext.Provider value={{ allEvents, loading, footerDetails }}>
      {children}
    </AllEventsDataContext.Provider>
  );
};
