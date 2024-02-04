import React, { Component } from "react";
import moment from "moment";
import "./HomeSelectionWeekBar.css";
import HomeSelectionWeekBarDayItem from "./HomeSelectionWeekBarDayItem";

class HomeSelectionWeekBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentWeekStart: moment().startOf("week"),
      currentDate: moment(),
    };

    this.previousWeek = this.previousWeek.bind(this);
    this.nextWeek = this.nextWeek.bind(this);
    this.selectDay = this.selectDay.bind(this);
    this.selectToday = this.selectToday.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      currentDate: moment(nextProps.selectedDay),
      currentWeekStart: moment(nextProps.selectedDay).startOf("week"),
    });
  }

  previousWeek() {
    this.setState({
      currentWeekStart: moment(this.state.currentWeekStart).subtract(1, 'weeks')
    });
  }

  nextWeek() {
    this.setState({
      currentWeekStart: moment(this.state.currentWeekStart).add(1, 'weeks')
    });
  }

  /* 0 is sunday, 1 is monday, etc */
  selectDay(event) {
    let target = event.target;

    if (target.getAttribute("index") === null) {
      target = target.parentElement;
    }

    if (target.getAttribute("index") === null) {
      target = target.parentElement;
    }

    let index = target.getAttribute("index");

    let m = moment(this.state.currentWeekStart);
    m = m.add(index, 'days');
    this.setState({
      currentDate: m
    });

    this.props.onSelectDay(moment(m));
  }

  selectToday() {
    const m = moment();
    this.setState({
      currentDate: moment(m)
    });
    this.props.onSelectDay(moment(m));
  }

  render() {
    let dayTagsData = [];

    for (let i = 0; i < 7; i++) {
      dayTagsData.push({
        index: i,
        day: moment(this.state.currentWeekStart).add(i, 'days').format('ddd').toUpperCase(),
        date: moment(this.state.currentWeekStart).add(i, 'days').date(),
        active: moment(this.state.currentWeekStart).add(i, 'days').format('MMM Do YY') === moment(this.state.currentDate).format('MMM Do YY'),
        isToday: moment(this.state.currentWeekStart).add(i, 'days').format('MMM Do YY') === moment().format('MMM Do YY')
      });
    }

    const dayTags = dayTagsData.map(
      day => <HomeSelectionWeekBarDayItem
        onClick={this.selectDay}
        key={day.date}
        data={day}
        categories={this.props.categories} />
    );

    return (
      <div className="HomeSelectionWeekBar">
        <div className="header">
          <h1><span className="bold">{this.state.currentDate.format('dddd')}</span>, {this.state.currentDate.format('MMMM Do')}</h1>
          <h1 className="outline" onClick={this.selectToday}>Today</h1>
        </div>
        <div className="weekbar">
          <div className="left-button" onClick={this.previousWeek} />
          <div className="weekdays">
            {dayTags}
          </div>
          <div className="right-button" onClick={this.nextWeek} />
        </div>
      </div>
    );
  }
}

export default HomeSelectionWeekBar;
