import React, { useRef, useEffect } from 'react';
import {
  axisTop,
  select,
  scaleBand,
  scaleLinear,
  max,
  interpolateNumber,
  interpolateRound,
  format,
  easeLinear,
  range
} from 'd3';

import { useResizeObersver } from '../Utils/Utils'
import '../App.css'

function RacingBarChartThree({ data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObersver(wrapperRef);

  // when we receive new data or the screen resizes, then we run this
  useEffect(() => {
    const svg = select(svgRef.current)
    if (!dimensions) return;

    // form the y scale
    // this is simply a ordinal scale of n bars evenly spaced with small padding
    const yScale = scaleBand()
      .paddingInner(0.1)
      .domain(range(data.length))
      .range([0, dimensions.height]);

    // x scale is a simple linear scale - will need updated as the animation runs
    const xScale = scaleLinear()
      .domain([0, max(data, (d) => d.value)])
      .range([0, dimensions.width]);

    // define an x-axis
    const xAxis = axisTop(xScale)
      .ticks(dimensions.width / 160)
      .tickSize(-dimensions.height)
      .tickFormat(d => format(',')(d));

    svg
      .selectAll('.x-axis')
      .transition()
      .duration(250)
      .ease(easeLinear)
      .call(xAxis)
      .selectAll('.tick line')
      //.attr('stroke', 'white')
      .select(".domain").remove();

    // draw the bars
    svg
      .selectAll('.bar')
      .data(data, d => d.name)
      .join(
        enter => enter.append('rect')
          .attr('class', 'bar')
          .attr('x', xScale(0))
          .attr('width', d => xScale(d.value) - xScale(0))
          .attr("height", yScale.bandwidth())
          .attr('y', d => yScale(d.rank))
          .style('fill', d => d.color)
          .attr("fill-opacity", 0.6),
        update => update,
        exit => exit.remove()/*transition()
          .attr('width', d => xScale(d.value) - xScale(0))
          .attr('y', yScale(data.length))
          .remove()*/
      )
      .transition()
      .duration(250)
      .ease(easeLinear)
      .attr('width', d => xScale(d.value) - xScale(0))
      .attr('y', d => yScale(d.rank))


    svg
      .selectAll('.label')
      .data(data, d => d.name)
      .join(
        enter => enter.append('text')
          .attr('class', 'label')
          .attr('dy', '1em')
          .attr("y", d => yScale(d.rank))
          .attr('x', d => xScale(d.value) - 8)
          .attr('text-anchor', 'end')
          .text(d => d.name),
        update => update,
        exit => exit.remove()/*transition()
          .duration(250)
          .ease(easeLinear)
          .attr('x', d => xScale(d.value) - 8)
          .attr('y', d => yScale(data.length))
          .remove()*/
      )
      .transition()
      .duration(250)
      .ease(easeLinear)
      .attr('x', d => xScale(d.value) - 8)
      .attr('y', d => yScale(d.rank))

    svg
      .selectAll('.valueLabel')
      .data(data, d => d.name)
      .join(
        enter => enter.append('text')
          .attr('class', 'valueLabel')
          .attr('y', d => yScale(d.rank))
          .attr('dy', '2.1em')
          .attr('x', d => xScale(d.value) - 8)
          .attr('text-anchor', 'end')
          .text(d => format(',.0f')(d.prevValue)),
        update => update,
        exit => exit.remove()/*transition()
          .duration(250)
          .ease(easeLinear)
          .attr('x', d => xScale(d.value) - 8)
          .attr('y', d => yScale(data.length))
          .remove()*/
      )
      .transition()
      .duration(250)
      .ease(easeLinear)
      .attr('x', d => xScale(d.value) - 8)
      .attr('y', d => yScale(d.rank))
      .tween("text", function (d) {
        let i = interpolateRound(d.prevValue, d.value);
        return function (t) {
          this.textContent = format(',')(i(t));
        };
      });

    svg
      .append('text')
      .style("font-variant-numeric", "tabular-nums")
      .style("font-family", 'sans-serf')
      .attr("text-anchor", "end")
      .style("font-size", "34px")
      .style('font-weight', 'bold')
      .attr("x", dimensions.width - 6)
      .attr("y", dimensions.height - yScale.bandwidth())
      .attr("dy", "0.75em")
      .transition()
      .remove()
      .text(data[0].date.getFullYear())

  }, [data, dimensions])

  return (
    <React.Fragment>
      <div ref={wrapperRef} className={'chart'}>
        <svg ref={svgRef}>
          <g className='x-axis' />
        </svg>
      </div>
    </React.Fragment>
  )
}

export default RacingBarChartThree;
