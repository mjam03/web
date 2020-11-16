import React, { useState, useEffect } from 'react';

import BarChart from '../Charts/BarChart.js'

export default function BarChartExample() {
  const [data, setData] = useState([25, 30, 45, 60, 20, 65, 75]);

  return (
    <div className='bar-chart'>
      <BarChart data={data} />
      <button onClick={() => setData(data.map(value => value + 5))}>
        Update data
            </button>
      <button onClick={() => setData(data.filter(value => value < 35))}>
        Filter data
            </button>
      <button onClick={() => setData([...data, Math.round(Math.random() * 100)])}>
        Add data
      </button>
    </div>
  )
}
