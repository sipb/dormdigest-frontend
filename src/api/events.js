import Request from "./request";
import Categories from "./categories";
import LocalData from "./localdata";
import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const axiosCached = setupCache(axios.create(), {
  methods: ['get', 'post']
});

//Caching parameters
const GET_FREQUENCY_BY_MONTH_EXPIRATION = 1000 * 60 * 60 * 6; //6 hours in miliseconds
const GET_EVENTS_BY_DATE_EXPIRATION = 1000 * 60 * 60 * 6; //6 hours in miliseconds

class Events {
  static getEventFrequencyByDateForMonth(month, year, filter_by_sent_date) { 
    const results = this.getCategoryFrequencyByMonth(month, year,filter_by_sent_date).then(eventsJSON => {
      const rawCategoryFrequency = eventsJSON["frequency"]; //Holds dictionary mapping day of month to frequency of categories on that day
      const parsedCategoryFrequency = {};

      for (const [day, rawFrequencyDict] of Object.entries(rawCategoryFrequency)) {
        parsedCategoryFrequency[day] = Categories.parseCategoryNameFrequency(rawFrequencyDict);
      }
      return parsedCategoryFrequency;
    });
    return results;
  }

  // static getEventsByQuery(query) { //Unsupported
  //   return new Request("https://localhost:8432/events?q=" + query);
  // }

  // static getEventById(id) { //Unsupported
  //   return new Request("https://localhost:8432/events/" + id);
  // }

  // static getAllEvents() { //Unsupported
  //   return new Request("https://localhost:8432/events/all");
  // }

  static getCategoryFrequencyByMonth(month, year, filter_by_sent_date) {
    const JSONrequest =  {
      month: month,
      year: year,
      auth: LocalData.getUserAuthInfo(),
      filter_by_sent_date: filter_by_sent_date
    };
    const res = axios
      .post(process.env.REACT_APP_BACKEND_URL+"/get_event_category_frequency_for_month", 
            JSONrequest,
            {
              cache:{
                ttl: GET_FREQUENCY_BY_MONTH_EXPIRATION, //1 hour
              }
            }
      )
      .then((response)=>{
        return response.data;
      })
      .catch((error)=>{
        console.error('Error:', error);
        throw error;
      });
    return res;
  }

  static getEventsByDate(formattedDate, filter_by_sent_date, includeDescription=true ) {
    const JSONrequest =  {
      from_date: formattedDate,
      include_description: includeDescription,
      auth: LocalData.getUserAuthInfo(),
      filter_by_sent_date: filter_by_sent_date
    };
    const res = axios
      .post(process.env.REACT_APP_BACKEND_URL+"/get_events_by_date", 
            JSONrequest,
            {
              cache:{
                ttl: GET_EVENTS_BY_DATE_EXPIRATION,
              }
            }
      )
      .then((response)=>{
        return response.data;
      })
      .catch((error)=>{
        console.error('Error:', error);
        throw error;
      });
    return res;
  }
  
}

export default Events;
