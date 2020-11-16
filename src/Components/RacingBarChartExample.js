import React, { useState } from 'react';

import RacingBarChart from '../Charts/RacingBarChart.js'
import { useInterval } from "../Utils/Utils";

// helper fn to get a random index in an array
// Math.random returns val in (0,1)
// this rounds down to nearest integer and returns
const getRandomIndex = array => {
  return Math.floor(array.length * Math.random());
};

export default function RacingBarChartExample() {
  // initialise race specific state
  const [iteration, setIteration] = useState(0);
  const [start, setStart] = useState(false);
  const [data, setData] = useState([
    {
      name: "alpha",
      value: 10,
      color: "#f4efd3"
    },
    {
      name: "beta",
      value: 15,
      color: "#cccccc"
    },
    {
      name: "charlie",
      value: 20,
      color: "#c2b0c9"
    },
    {
      name: "delta",
      value: 25,
      color: "#9656a1"
    },
    {
      name: "echo",
      value: 30,
      color: "#fa697c"
    },
    {
      name: "foxtrot",
      value: 35,
      color: "#fcc169"
    }
  ]);

  useInterval(() => {
    // if racing
    if (start) {
      // get random index in array of racers
      const randomIndex = getRandomIndex(data);
      setData(
        // if matches index then increment value by 10
        // use spread op to maintain rest of data in each obj
        data.map((entry, index) =>
          index === randomIndex
            ? {
              ...entry,
              value: entry.value + 10
            }
            : entry
        )
      );
      // inc iteration by 1 and run every 0.5 seconds
      setIteration(iteration + 1);
    }
  }, 50);

  return (
    <div className='bar-chart'>
      <RacingBarChart data={data} />
      <button onClick={() => setStart(!start)}>
        {start ? "Stop the race" : "Start the race!"}
      </button>
      <p>Iteration: {iteration}</p>
    </div>
  )
}
