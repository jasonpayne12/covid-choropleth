import * as d3 from 'd3';
import * as topojson from 'topojson';

const api = 'https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json';
const covidapi = 'https://data.cdc.gov/resource/kn79-hsxy.json';
const width = 1600;
const height = 800;

function getCounties() {
    const [data, setData] = React.useState();
    React.useEffect(() => {
        fetch(api)
            .then(response => response.json())
            .then(data => setData(data))
    }, []);
    return data
}

function getCovid() {
    const [data, setData] = React.useState();
    React.useEffect(() => {
        fetch(covidapi)
            .then(response => response.json())
            .then(data => setData(data))
    }, []);
    return data
}

export default function StateSvg() {

    const statesAlbersJson = getCounties();
    const covidJson = getCovid();

    if (!statesAlbersJson || !covidJson) {
        return <h1>Getting you the most up to date COVID-19 data...</h1>
    }

    const topoCountyData = topojson.feature(statesAlbersJson, statesAlbersJson.objects.counties).features;

    const topoStateData = topojson.feature(statesAlbersJson, statesAlbersJson.objects.states).features;

    const covidDeaths = new Map(covidJson.map(obj => [obj.county_fips_code.size == 5 ? obj.county_fips_code : '0' + obj.county_fips_code, obj.covid_death]));

    console.log(covidDeaths.get('17031'))
    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    var svg = d3.select('#__next')
        .append('svg')
        .attr("viewBox", [0, 0, width, height])
        .on("click", reset)
        .attr('height', height)
        .attr('width', width)
        .append('g')
        .attr("cursor", "pointer")
        .attr('transform', 'translate('+ 0 + ',' + 0 +')');

    var projection = d3.geoAlbersUsa()
        .translate([width/2, height/2])
        .scale(width);

    const path = d3.geoPath()
        .projection(projection);

    svg.selectAll('.county')
        .data(topoCountyData)
        .enter()
        .append('path')
        .attr('class', 'county')
        .attr('id', function(d) { return d.properties.name })
        .on("click", clicked)
        .attr('d', path)
        .append("title")
        .text(d => d.properties.name + ' ' + (covidDeaths.has(d.id) ? covidDeaths.get(d.id) : '0'));

    svg.selectAll('.state')
        .data(topoStateData)
        .enter()
        .append('path')
        .attr('class', 'state')
        .attr('id', function(d) { return d.properties.name })
        .attr('d', path)
        .append("title")
        .text(d => d.properties.name);


    svg.call(zoom);

    function reset() {
        svg.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity,
            d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
        );
    }

    function clicked(d) {
        const [[x0, y0], [x1, y1]] = path.bounds(d);
        d3.event.stopPropagation();
        svg.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity
                .translate(width / 2, height / 2)
                .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
            d3.mouse(svg.node())
        );
    }

    function zoomed() {
        const {transform} = d3.event;
        d3.select('g').attr("transform", transform);
        d3.select('g').attr("stroke-width", 1 / transform.k);
    }

    return null;

}