import React, { Component } from "react";
import moment from "moment";

import Categories from "../../../api/categories";
import Events from "../../../api/events";
import HomeFeedEventView from "./HomeFeedEventView";
import "./HomeFeedView.css";
import LocalData from "../../../api/localdata";
import { FilterEventsBySearchAndCategories } from "../../../utils/filters";
import { Switch, FormControl, FormLabel } from "@chakra-ui/react";

class HomeFeedView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      searchCount: 0,
      searching: false,
      colors: Categories.getCategoriesColorMapping()
    };

    this.saveEventData = this.saveEventData.bind(this);
    this.parseCategories = this.parseCategories.bind(this);
    const self = this;

  
    Events.getEventsByDate(moment().format("YYYY-MM-DD"),this.props.filter_by_sent_date).then(response => {
      self.saveEventData(response);
    })

    // Categories.getCategoriesColorMapping().then(response => {
    //   let tempColors = {};
    //   for (let i = 0; i < response.data.length; i++) {
    //     tempColors[response.data[i].name] = response.data[i]["color"];
    //   }
    //   this.setState({
    //     colors: tempColors
    //   });
    // });
  }

  componentWillReceiveProps(nextProps) {
    const self = this;
    const searching = nextProps.search.length > 0;
    const searchCount = this.state.searchCount + 1;


    Events.getEventsByDate(nextProps.selectedDay.format("YYYY-MM-DD"), nextProps.filter_by_sent_date).then(response => {
      self.saveEventData(response);
    });

    this.setState({
      searchCount: searchCount,
      searching: searching,
    });
  }
  saveEventData(eventData) {
    eventData.events.forEach((event, index) => {
      if (eventData.tags[index]) {
        const event_tags = eventData.tags[index]; //Name of categories associated with the event
        if(event_tags && event_tags.length > 0) {
          event.tags = event_tags;
        } else {
          event.tags = Categories.getDefaultCategoryTags();
        }
        event.user_email = eventData.users[index]; //Email of the user who sent/submitted the event
        event.description = eventData.descriptions[index]; //Plaintext email description
        event.description_html = eventData.descriptions_html[index]; //HTML email description
      }
    });

    // Getting what the user is searching
    let search_target = null;
    if (this.state.searchCount + 1 < this.state.searchCount) {
      search_target = "";
    }
    else {
      search_target = (this.props.search);
    }
    //Creating a new list matchingEvents that contains events that have categories matching with the categories the user has selected and words the user has searched
    const matchingEvents = FilterEventsBySearchAndCategories(eventData, search_target);
    if (this.props.filter_by_sent_date){
      matchingEvents.forEach((event)=>{
        event.start_time = event.date_created.substring(event.date_created.indexOf("T")+1)
      })
    }
    const events = matchingEvents

    let times = [];

    let data = (events) ?
      events.sort((a, b) => {
      let aTime = moment(a.start_time).valueOf();
      let bTime = moment(b.start_time).valueOf();

      if (aTime > bTime) {
        return 1;
      } else if (aTime < bTime) {
        return -1
      }

      return 0;
    }): []


    for (var i = 0; i < data.length; i++) {
      if (times.length === 0) {
        times.push([data[i]]);
      } else {
        if (moment(times[times.length - 1][0].start_time).valueOf() === moment(data[i].start_time).valueOf()) {
          times[times.length - 1].push(data[i]);
        } else {
          times.push([data[i]]);
        }
      }
    }
    for (var j = 0; j < data.length; j++) {
      data[j].tags = this.parseCategories(data[j].tags);
    }

    this.setState({
      data: times
    });
  }

  parseCategories(categories) {
    const tags = Categories.getCategoriesList();
    return categories.map(category => tags[category]);
  }

  render() {
    let elements = [];

    for (var i = 0; i < this.state.data.length; i++) {
      elements.push(
        <div className="timeline" key={"times" + i + "1"}>
          <div className="sideline">
            <div className="ball"></div>
          </div>
        </div>
      );
      let timeString = moment(`${this.state.data[i][0].start_date}T${this.state.data[i][0].start_time}`)
      timeString = timeString.format("h:mm a");

      elements.push(
        <div className="onetime" key={"times" + i + "2"}>{timeString}</div>
      );
      for (var j = 0; j < this.state.data[i].length; j++) {
        let selected = false;

        if (this.props.selectedEvent !== null) {
          selected = this.props.selectedEvent.id === this.state.data[i][j].id;
        }


        elements.push(
          <div className="timeevents" key={this.state.data[i][j].id}>
            <div className="sidespace" />
            <HomeFeedEventView
              event={this.state.data[i][j]}
              selected={selected}
              onClick={this.props.onSelectEvent}
              colors={this.state.colors} />
          </div>
        );
      }
    }

    if (elements.length === 0) {
      elements = <div className="empty-events">
        <img className="empty-events-icon" src="img/empty.png" />
        <h1 className="empty-events-label">No events found!</h1>
      </div>
    }

    return (
      <>
      <FormControl display="flex" justifyContent="flex-end" alignItems="center">
        <FormLabel marginRight="1vw" htmlFor="email-alerts" mb="0">
          Parsed Dates
        </FormLabel>
        <Switch  margin="0" colorScheme="brand" onChange={this.props.handleClick}/>
        <FormLabel marginRight="0" marginLeft="1vw" htmlFor="email-alerts" mb="0">
          Sent Dates
        </FormLabel>
      </FormControl>
      <div className="HomeFeedView">
        {elements}
      </div>
      </>
    );
  }
}

export default HomeFeedView;