import React, { Component } from "react";
import moment from "moment";

import Categories from "../../../../api/categories";
import Events from "../../../../api/events";
import HomeSidebarCalendarDayItem from "./HomeSidebarCalendarDayItem";
import "./HomeSidebarCalendar.css";

class HomeSidebarCalendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      today: moment(),
      m: moment(),
      frequencies: {},
      colors: {...Categories.getCategoriesColorMapping()},
    };

    this.previousMonth = this.previousMonth.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
    this.selectDay = this.selectDay.bind(this);

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

  componentDidMount() {
    const month = moment(this.state.m).month() + 1; //Moment is zero-indexed, need value from 1 to 12
    const year = moment(this.state.m).year();
    Events.getEventFrequencyByDateForMonth(month,year, this.props.filter_by_sent_date).then(response => {
      this.setState({
        frequencies: response
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      today: moment(nextProps.selectedDay),
      m: moment(nextProps.selectedDay)
    });
    
    // let freqDate = typeof nextProps !== "undefined" ? nextProps.selectedDay : this.state.m
    const month = moment(this.state.m).month() + 1; //Moment is zero-indexed, need value from 1 to 12
    const year = moment(this.state.m).year();
    Events.getEventFrequencyByDateForMonth(month,year, nextProps.filter_by_sent_date).then(response => {
      this.setState({
        frequencies: response
      });
    });
  }

  previousMonth() {
    this.setState({
      m: this.state.m.subtract(1, 'months')
    });
    const month = moment(this.state.m).month() + 1; //Moment is zero-indexed, need value from 1 to 12
    const year = moment(this.state.m).year();
    Events.getEventFrequencyByDateForMonth(month,year, this.props.filter_by_sent_date).then(response => {
      this.setState({
        frequencies: response
      });
    });
  }

  nextMonth() {
    this.setState({
      m: this.state.m.add(1, 'months')
    });
    const month = moment(this.state.m).month() + 1; //Moment is zero-indexed, need value from 1 to 12
    const year = moment(this.state.m).year();
    Events.getEventFrequencyByDateForMonth(month,year, this.props.filter_by_sent_date).then(response => {
      this.setState({
        frequencies: response
      });
    });
  }

  /* 0 is sunday, 1 is monday, etc */
  selectDay(event) {
    let target = event.target;

    while (target.getAttribute("moment") === null) {
      target = target.parentElement;
    }

    let m = target.getAttribute("moment");

    this.setState({
      today: moment(m),
      m: moment(m),
    });

    this.props.onSelectDay(moment(m));    // to sync with week view
  }

  render() {
    let dayTagsData = [];
    const m = moment(this.state.m);

    const monthStart = m.startOf("month");
    let monthEnd = moment(monthStart);
    monthEnd = monthEnd.endOf("month");

    const weekStart = monthStart.startOf("week");
    const weekEnd = monthEnd.endOf("week");

    for (let m = weekStart; m.isBefore(weekEnd); m.add(1, 'days')) {
      dayTagsData.push({
        moment: m.format(),
        date: m.date(), //Day number
        active: m.isSame(this.state.today, 'day'), //Whether it's clicked on by user
        focus: m.isSame(this.state.m, 'month'),    //Whether it's in focus (e.g. part of the currently viewed month)
        isToday: m.format('MMM Do YY') === moment().format('MMM Do YY'), 
        hasEvent: (m.format("YYYY-MM-DD") in this.state.frequencies), //Has at least one event happening in it
        frequencies: (m.format("YYYY-MM-DD") in this.state.frequencies) ? this.state.frequencies[m.format("YYYY-MM-DD")] : Categories.getCategoriesEmptyFrequency()
    });
  }

    const dayTags = dayTagsData.map(
      (day, i) => <HomeSidebarCalendarDayItem
                    key={i}
                    moment={day.moment}
                    day={day.date}
                    active={day.active}
                    focus={day.focus}
                    isToday={day.isToday}
                    hasEvent={day.hasEvent}
                    onClick={this.selectDay}
                    frequencies={day.frequencies}
                    colors={this.state.colors}
                    categories={this.props.categories}
                  />
    );

    return (
      <div className="HomeSidebarCalendar">
        <div className="header">
          <div className="left-button" onClick={this.previousMonth}/>
          <h2>{this.state.m.format('MMMM YYYY')}</h2>
          <div className="right-button" onClick={this.nextMonth}/>
        </div>
        <div className="calendar">
          {dayTags}
        </div>
      </div>
    );
  }
}

export default HomeSidebarCalendar;
