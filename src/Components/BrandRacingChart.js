import React, { useState, useEffect } from 'react';
import {
  scaleOrdinal,
  schemeTableau10
} from 'd3';

import RacingBarChartThree from '../Charts/RacingBarChartTwo.js';
import { useInterval } from "../Utils/Utils";
import { loadLocalCsv } from "../Utils/DataUtils";
import '../App.css';

export default function BrandRacing(props) {

  const { classes } = props;

  /* function will import data from a csv
   * then it needs to manipulate the data so we have an array of objects that have:
    * year
    * name (of company)
    * value
    * rank for that time slice
    * prev value
   * this can then be set to state as our data
   * we can then define how long we want the animation to take, how long per transition and how many intervals
  */

  const [iteration, setIteration] = useState(0); // used to control which obj in array we pass
  const [rawData, setRawData] = useState(null); // set the raw csv data for record
  const [keyframes, setKeyframes] = useState(null); // this is our array of data to pass to the svg component
  const [start, setStart] = useState(false); // control button state for whether to run animation or not

  // define animation properties
  const numDisplay = 12; // display top 12 brands
  const numInterps = 12; // create 12 interps per year (as raw data only has annual data)

  const createFrameData = (data) => {
    // callback function to operate on the raw csv data
    data = data.map(d => ({ ...d, date: new Date(d.date) })); // convert date attr to date type

    // as dates are objs, cannot use set to get distinct as they are not comp like e.g. strings
    const allDates = data.map(d => d.date);
    const uniqueDates = allDates
      .map(s => s.getTime()) // gets time prop (a number)
      .filter((s, i, a) => a.indexOf(s) === i) // compares if this is the first instance
      .sort((a, b) => a - b) // sort them oldest date to newest
      .map(s => new Date(s)); // maps back into a date

    // now we create pairs of dates and interp between them
    let datePairs = [];
    uniqueDates.forEach(d => {
      if (!(uniqueDates.indexOf(d) === uniqueDates.length - 1)) {
        // if not final element, then create pair
        let nextDate = uniqueDates[uniqueDates.indexOf(d) + 1];
        datePairs.push([d, nextDate]);
      }
    });

    // now we need to iterate over each of these pairs
    /* Steps:
      * Filter big array for data for each start and end date
      * For each step in interps (12 currently):
       * Define new date as blend
       * For each company:
        * Create linear interp
        * If not in start or end, then assume 0
        * Create new obj with new date and value
        * Push to new data array
    */

    let newData = [];
    // now we init a map of last values to be used for prevValue - init with first
    const prevValueMap = {};
    const initValues = data.filter(d => d.date.getTime() === uniqueDates[0].getTime());
    initValues.forEach(d => {
      prevValueMap[d.name] = d.value;
    })

    // get all names for color scale
    const allNames = [...new Set(data.map(d => d.name))];
    const colorScale = scaleOrdinal(schemeTableau10)
      .domain(allNames);

    datePairs.forEach(([start, end]) => {
      // get start and end data from all data array
      const startData = data.filter(d => d.date.getTime() === start.getTime());
      const endData = data.filter(d => d.date.getTime() === end.getTime());

      // define all company names as some enter and leave
      const allDateNames = [...new Set(startData.map(d => d.name).concat(endData.map(d => d.name)))];

      allDateNames.forEach(n => {
        // define start and end data for each company
        const startDataName = startData.filter(d => d.name === n)[0] || {};
        const endDataName = endData.filter(d => d.name === n)[0] || {};

        let prevValue;
        for (let i = 0; i < numInterps; i++) {
          if (i === 0) {
            prevValue = prevValueMap[n];
          }
          const f = i / numInterps; // define frac of interp
          const newDate = new Date(start * (1 - f) + end * f); // define new date
          const newValue = (startDataName['value'] || 0) * (1 - f) + (endDataName['value'] || 0) * f;

          const newObs = {
            date: newDate,
            name: n,
            category: (endDataName['category'] || startDataName['category']),
            value: newValue,
            prevValue: prevValue,
            color: colorScale(n)
          };
          prevValue = newValue;
          newData.push(newObs);
          if (i === numInterps - 1) {
            prevValueMap[n] = newValue;
          }
        }
      });
    });

    // now we need to group the data by the dates, filter them, sort them and add rank attribute
    const allNewDates = newData.map(d => d.date);
    const uniqueNewDates = allNewDates
      .map(s => s.getTime()) // gets time prop (a number)
      .filter((s, i, a) => a.indexOf(s) === i) // compares if this is the first instance
      .sort((a, b) => a - b) // sort them oldest date to newest
      .map(s => new Date(s)); // maps back into a date

    const keyframes = [];
    uniqueNewDates.forEach(date => {
      let timeSlice = newData.filter(d => d.date.getTime() === date.getTime());
      timeSlice = timeSlice.sort((a, b) => b.value - a.value);
      timeSlice.forEach((d, i) => d.rank = i);
      keyframes.push([date, timeSlice]);
    });

    // set our manipulated data down into state
    // console.log('Data loaded, state has been set');
    setRawData(newData);
    setKeyframes(keyframes);
  };

  useEffect(() => {
    // load data from csv and run parsing func
    loadLocalCsv('./data/data.csv', createFrameData);
  }, [])

  // this keeps passing the data to the svg d3 component
  useInterval(() => {
    // if racing
    if (start && keyframes) {
      if (iteration < keyframes.length - 1) {
        setIteration(iteration + 1);
      }
    };
  }, 250);

  return (
    <div className={classes.root}>
      <div className={'chart-example'}>
        <div>
          <button onClick={() => setStart(!start)}>
            {start ? "Stop the race" : "Start the race!"}
          </button>
          <button onClick={() => { setIteration(0); setStart(false) }}>
            'Restart'
          </button>
        </div>
        <div></div>
        <div></div>
        {keyframes ? <RacingBarChartThree data={keyframes[iteration][1].slice(0, numDisplay)} /> : null}
      </div>
    </div>
  )
}
