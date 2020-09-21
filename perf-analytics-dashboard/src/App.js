import React, { Component } from 'react';
import './App.css';
import DateTimeRangePicker from "./DateTimeRangePicker/DateTimeRangePicker";
import { Button } from "react-bootstrap";
import moment from "moment"
import axios from 'axios';

export default class App extends Component {

  constructor (props) {
    super(props);
    this.state = {
      start: new Date(),
      end: moment(new Date())
        .subtract("30", "minutes")
    }
  }

  getDataFromAPI = () => {
    const { start, end } = this.state;

    axios.get(`http://localhost:5000`, {
      params: {
        beginTime: start,
        endTime: end
      }
    })
      .then(res => {
        console.log(res);
      })
  }

  setTimeRange = (time) => {
    const { start, end } = time;
    console.log(new Date(start), new Date(end));
    this.setState({
      start: new Date(start).getTime(),
      end: new Date(end).getTime()
    }, () => {
      console.log(this.state.start, this.state.end)
    })
  }

  render () {
    return (
      <div className="container">
        <div className="header-container row">
          <div className="col-md-6 date-range-picker-container">
            <DateTimeRangePicker setTimeCallback={(time) => this.setTimeRange(time)}/>
          </div>
          <div className="col-md-3"/>
          <div className="col-md-3 text-center">
            <Button variant="success" onClick={this.getDataFromAPI}>Refresh Dashboard</Button>{' '}
          </div>
        </div>
        <div className="content-container">
          <div className="charts-container">
          </div>
        </div>
      </div>
    );
  }
}
