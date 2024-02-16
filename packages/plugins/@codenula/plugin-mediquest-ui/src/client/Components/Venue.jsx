import React from 'react';
import { EventDetailsProvider, useAllEventsData } from '../context/EventDetailsProvider';
import { Link } from 'react-router-dom';
import StyledText from './StyledText.jsx';
import '../assets2/css/main.min.css';
import '../assets2/css/external.css';

export const Venue = (props) => {
  //   const { allEvents, loading } = useAllEventsData();
  //   const accEvent = allEvents[1];
  return (
    <>
      {/* <section class="venue-box">
      <div class="container">
        <h2>Venue</h2>
        <p class="heading34">Hotel Pullman, Aerocity Delhi</p>
        <div class="row-flex">
          <div class="col-left">
            <div class="mapimg">
              <img src="assets/images/map.png" alt="" class="maps" />
            </div>              
          </div>
          <div class="col-right">              
            <p class="heading30">Address:</p>
            <p class="heading30 textwhite">Hotel Pullman</p>
            <p class="heading28">
              Asset No 02, Gmr<br> Hospitality District, IGI Rd, Aerocity,<br> Delhi: 110037<br>
              Phone: <a href="javascript:void(0)"></a>011 4608 0808</p>
            </p>
            <a href="javascript:void(0)" class="btn btn-white">Get Directions</a>              
          </div>
        </div>          
      </div>
    </section> */}

      <section className="venue-box">
        <div className="container">
          <h2>{props.event.venue_title}</h2>
          <p className="heading34">{props.event.venue_name}</p>
          <div className="row-flex">
            <div className="col-left">
              <div className="mapimg">
                <StyledText className="pdf-view" htmlContent={props.event ? props.event.venue_map_img_link : ''} />
              </div>
            </div>
            <div className="col-right">
              <p className="heading30">Address:</p>
              <p className="heading30 textwhite">{props.event.venue[0].venue_name}</p>
              <p className="heading28">
                {props.event.venue[0].venue_address}
                <br />
                Phone: <a href={props.event.venue[0].venue_phone_number}>{props.event.venue_phone_number}</a>
              </p>
              <Link to={props.event.venue[0].venue_map_link}>
                <button className="btn btn-white">Get Directions</button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
