import React, { useRef, useEffect } from 'react';
import {
  select,
  axisBottom,
  scaleLinear,
  axisRight,
  scaleBand
} from 'd3';

import { useResizeObersver } from '../Utils/Utils'

function BarChart({ data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObersver(wrapperRef);

  // will be called initially and on every change to data
  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;

    // as bar chart, use scaleBand for categorical
    const xScale = scaleBand()
      .domain(data.map((value, index) => index))
      .range([0, dimensions.width])
      // can add padding to distinguish the bars
      .padding(0.5);

    // need to flip the domain / range as top left of svg is the starter in d3
    const yScale = scaleLinear()
      .domain([0, 150])
      .range([dimensions.height, 0]);

    // used to dictate color scale of each bar (using fill)
    const colorScale = scaleLinear()
      .domain([75, 120, 150])
      .range(['green', 'orange', 'red'])
      .clamp(true);

    // add x axis
    const xAxis = axisBottom(xScale)
      .ticks(data.length);
    svg
      .select('.x-axis')
      // required so x axis moves down 150px to bottom
      .style('transform', `translateY(${dimensions.height}px)`)
      // attach to the g element created in html
      // loads of tick elements get created within
      .call(xAxis);

    // add y axis and shift to right of screen
    const yAxis = axisRight(yScale);
    svg
      .select('.y-axis')
      .style('transform', `translateX(${dimensions.width}px)`)
      .call(yAxis);

    // draw the bars
    svg
      .selectAll('.bar')
      .data(data)
      // join a rect element for each data point
      .join('rect')
      // add class of bar to ref to
      .attr('class', 'bar')
      // flip the bars so bottom is constant during transition (rather than top left)
      .style('transform', 'scale(1, -1)')
      // fix bottom centre of each bar
      .attr('x', (value, index) => xScale(index))
      .attr('y', -dimensions.height) // due to 150 tall

      // set width using scale
      .attr('width', xScale.bandwidth())
      // give bars outline
      .attr('stroke', 'black')
      // event handler, must be defined pre transition
      .on('mouseenter', function (event, value) {
        // way to get the index for each bar element
        const index = svg.selectAll(".bar").nodes().indexOf(this);
        svg
          .selectAll('.tooltip')
          .data([value])
          // on new data, create text and assign just above bar
          .join((enter) => enter.append("text").attr("y", yScale(value) - 4))
          // set class and value
          .attr('class', 'tooltip')
          .text(value)
          // centre the tooltip
          .attr('text-anchor', 'middle')
          .attr('x', xScale(index) + xScale.bandwidth() / 2)
          // transition to slightly higher with font fade
          .transition()
          .attr("y", yScale(value) - 8)
          .attr('opacity', 1)
      })
      // remove the tooltip when not on bar
      .on('mouseleave', () => svg.selectAll('.tooltip').remove())
      // this dictates the transition between data
      .transition()
      // changes the fill color
      .attr('fill', (value) => colorScale(value))
      // sets the height, need to flip again as top left
      .attr('height', (value) => dimensions.height - yScale(value))


  }, [data, dimensions])

  return (
    <React.Fragment>
      <div ref={wrapperRef} style={{ marginBottom: '2rem' }}>
        <svg ref={svgRef}>
          <g className='x-axis' />
          <g className='y-axis' />
        </svg>
      </div>
    </React.Fragment>
  )
}

export default BarChart;
