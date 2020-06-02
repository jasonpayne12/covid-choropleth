// import Link from 'next/link'
// import * as d3 from 'd3';
// import * as topojson from 'topojson';
//
//
// export default function FirstPost() {
//
//     var stateSvg = CreateTopo();
//
//     return (
//         <svg id="states" src=this.stateSvg></svg>
//     )
// }
//
// async function CreateTopo() {
//
//     var svg = d3.select('#states')
//         .attr('height', 400)
//         .attr('width', 800)
//         .append('g');
//
//     const stateData = await d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json');
//
//     console.log(stateData);
//
//     const topoStateData = topojson.feature(stateData, stateData.objects.states).features;
//
//     console.log(topoStateData);
//
//
//     var path = d3.geoPath()
//         .projection(d3.geoAlbersUsa());
//
//     svg.selectAll('.state')
//         .data(stateData)
//         .enter()
//         .append('path')
//         .attr('class', 'state')
//         .attr('g', path);
//
//     // var statesData = import('../../topojson/states-10m.json');
//
//     // const svg = d3.create('svg')
//     //     .attr('width', 500)
//     //     .attr('height', 500)
//     //
//     // svg.selectAll('state')
//     //     .data(statesData)
//     //     .enter()
//     //     .append('state')
//     //     .attr('id', function(d) { return d.id })
//     //     .append('svg:title')
//     //     .text(function(d) { return 'State: ' + d.properties.name});
//
//
//     return {
//         props: {
//             svg: svg,
//         },
//     }
// }
//
