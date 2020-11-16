import React, { useRef, useEffect } from 'react';
import {
  select,
  scaleBand,
  scaleLinear,
  max
} from 'd3';

import { useResizeObersver } from '../Utils/Utils'

function RacingBarChart({ data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObersver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;

    // sort the data by the value attr
    data.sort((a, b) => b.value - a.value);

    const yScale = scaleBand()
      .paddingInner(0.1)
      .domain(data.map((value, index) => index))
      .range([0, dimensions.height]);

    const xScale = scaleLinear()
      .domain([0, max(data, entry => entry.value)])
      .range([0, dimensions.width]);

    // draw the bars
    svg
      .selectAll('.bar')
      .data(data, entry => entry.name)
      .join(enter =>
        enter.append('rect').attr('y', (entry, index) => yScale(index))
      )
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('height', yScale.bandwidth())
      .attr('fill', entry => entry.color)
      .transition()
      .attr('width', entry => xScale(entry.value))
      .attr('y', (entry, index) => yScale(index))

    // draw the labels
    svg
      .selectAll('.label')
      .data(data, entry => entry.name)
      .join(enter =>
        enter.append('text').attr('y', (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5)
      )
      .text(entry => `🐎 ... ${entry.name} (${entry.value} metres)`)
      .attr('class', 'label')
      .attr('x', 10)
      .transition(10)
      .attr('y', (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5)

  }, [data, dimensions])


  return (
    <React.Fragment>
      <div ref={wrapperRef} style={{ marginBottom: '2rem' }}>
        <svg ref={svgRef}></svg>
      </div>
    </React.Fragment>
  )
}

export default RacingBarChart;
