import { Component, ElementRef, Input } from '@angular/core'
import * as d3 from 'd3'

const VALUE_TEXT_COLORS = ['#5AC8FA', '#FFB956']

const RADAR_COLORS = ["#5AC8FA", "#FFA629"]

const RADAR_AREA_OPACITY = 0.6

const AXIS_DATA = [
    { axis: "收益能力", label: '收益能力', dx: 0, dy: -20, text_anchor: 'middle' },
    { axis: "稳定性", label: '稳定性', dx: 20, dy: -5, text_anchor: 'start' },
    { axis: "抗跌能力", label: '抗跌能力', dx: 15, dy: 30, text_anchor: 'middle' },
    { axis: "分散性", label: '分散性', dx: -15, dy: 30, text_anchor: 'middle' },
    { axis: "流动性", label: '流动性', dx: -20, dy: -5, text_anchor: 'end' },
]

const RADAR_DATA_TEMPLATE_1 = {
    "收益能力": { dx: -5, dy: -5, },
    "稳定性": { dx: 5, dy: 5, },
    "抗跌能力": { dx: 5, dy: 10, },
    "流动性": { dx: -15, dy: 5, },
    "分散性": { dx: -15, dy: 10, }
}

const RADAR_DATA_TEMPLATE_2 = [
    {
        "收益能力": { dx: 10, dy: -5, },
        "稳定性": { dx: 6, dy: 10, },
        "抗跌能力": { dx: -10, dy: 15, },
        "流动性": { dx: -20, dy: 10, },
        "分散性": { dx: -5, dy: 15, }
    }, {
        "收益能力": { dx: -20, dy: -5, },
        "稳定性": { dx: 2, dy: -5, },
        "抗跌能力": { dx: 8, dy: 10, },
        "流动性": { dx: -15, dy: -5, },
        "分散性": { dx: -25, dy: 5, }
    }]

@Component({
    selector: 'radar-graph',
    templateUrl: 'radar-graph.html',
})
export class RadarGraphComponent {

    @Input('portfolio') portfolio_data: any
    @Input('rebalance') rebalance_data: any


    legend: Array<any>
    constructor(public element: ElementRef) {

    }

    ngOnInit() {
        // console.log('ngOnInit')
    }

    ngAfterViewInit() {
        // console.log('ngAfterViewInit')
        this.draw()
    }

    ngOnChanges() {
        // console.log('ngOnChanges')
        this.draw()
    }

    draw() {

        const margin = { top: 40, right: 75, bottom: 40, left: 75 },
            width = this.element.nativeElement.offsetWidth - margin.left - margin.right,
            height = width

        const options = {
            w: width,
            h: height,
            margin: margin,
        }

        const radar_data = []

        if (this.rebalance_data && this.portfolio_data) {
            let model = Object.assign({}, RADAR_DATA_TEMPLATE_2[0])
            this.bind_data(model, this.portfolio_data)
            radar_data.push(model)
            model = Object.assign({}, RADAR_DATA_TEMPLATE_2[1])
            this.bind_data(model, this.rebalance_data)
            radar_data.push(model)

            this.legend = [{
                label: '投资组合',
                color: VALUE_TEXT_COLORS[0],
            }, {
                label: '优化',
                color: VALUE_TEXT_COLORS[1],
            }]
        } else if (this.portfolio_data) {
            let model = Object.assign({}, RADAR_DATA_TEMPLATE_1)
            this.bind_data(model, this.portfolio_data)
            radar_data.push(model)
            this.legend = [{
                label: '投资组合',
                color: VALUE_TEXT_COLORS[0],
            }]
        }
        if (radar_data.length > 0) {
            const container = d3.select(this.element.nativeElement).select('.container')
            renderRadarChart(container.node(), AXIS_DATA, radar_data, options)
        }
    }

    bind_data(radar_data, data) {
        radar_data['收益能力'].value = data.historical_return
        radar_data['流动性'].value = data.liquidity
        radar_data['稳定性'].value = data.historical_volatility
        radar_data['抗跌能力'].value = data.max_drawdown
        radar_data['分散性'].value = data.risk_resistance
    }
}

/**
 * ref : http://bl.ocks.org/nbremer/21746a9668ffdf6d8242#index.html
 */
function renderRadarChart(id, axis_data, radar_data, options) {
    const cfg = {
        w: 600,				//Width of the circle
        h: 600,				//Height of the circle
        margin: { top: 20, right: 20, bottom: 20, left: 20 }, //The margins of the SVG
        levels: 5,				//How many levels or inner circles should there be drawn
    };

    //Put all of the options into a variable called cfg
    if ('undefined' !== typeof options) {
        for (var i in options) {
            if ('undefined' !== typeof options[i]) { cfg[i] = options[i]; }
        }//for i
    }//if

    //If the supplied maxValue is smaller than the actual one, replace by the max in the data
    var maxValue = 10;

    const total = axis_data.length,					//The number of different axes
        radius = Math.min(cfg.w / 2, cfg.h / 2), 	//Radius of the outermost circle
        format_value = (v) => v >= 10 ? v : v.toFixed(1),			 	//Percentage formatting
        angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

    //Scale for the radius
    var rScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue]);

    //Remove whatever chart with the same id/class was present before
    d3.select(id).select("svg").remove();

    //Initiate the radar chart SVG
    var svg = d3.select(id).append("svg")
        .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
        .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
        .attr("class", "radar" + id);
    //Append a g element		
    var g = svg.append("g")
        .attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + (cfg.h / 2 + cfg.margin.top) + ")");

    //Wrapper for the grid & axes
    var g_grid_circle = g.append("g").attr("class", "g-grid-circle");

    //Draw the background circles
    g_grid_circle.selectAll(".levels")
        .data(d3.range(1, (cfg.levels + 1)).reverse())
        .enter()
        .append("circle")
        .attr("class", "grid-circle")
        .attr("r", function (d, i) { return radius / cfg.levels * d; })
        .style("fill", "transparent")
        .style("stroke", "#4A4A4A");



    //Create the straight lines radiating outward from the center
    var axis = g_grid_circle.selectAll(".axis")
        .data(axis_data)
        .enter()
        .append("g")
        .attr("class", "axis");
    //Append the lines
    axis.append("line")
        .attr("class", "axis-line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function (d, i) { return rScale(maxValue * 1) * Math.cos(angleSlice * i - Math.PI / 2); })
        .attr("y2", function (d, i) { return rScale(maxValue * 1) * Math.sin(angleSlice * i - Math.PI / 2); })


    //Append the labels at each axis
    axis.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", (d) => d.text_anchor)
        .attr("x", function (d, i) { return rScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2) + d.dx; })
        .attr("y", function (d, i) { return rScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2) + d.dy; })
        .text(function (d) { return d.label });



    //The radial line function
    var radarLine = d3.radialLine()
        .curve(d3.curveCatmullRomClosed)
        .radius(function (d) { return rScale(d.value); })
        .angle(function (d, i) { return i * angleSlice; });


    //Create a wrapper for the blobs	
    var rador_areas = g.selectAll(".g-rador-area")
        .data(radar_data)
        .enter().append("g")
        .attr("class", "g-rador-area");

    //Append the backgrounds	
    rador_areas
        .append("path")
        .attr("class", "radar-area")
        .attr("d", function (d, i) { return radarLine(build_radar_data(d, i)); })
        .style("fill", function (d, i) { return RADAR_COLORS[i]; })
        .style("fill-opacity", RADAR_AREA_OPACITY);


    var g_axis_value = g.selectAll(".axis-value")
        .data(radar_data)
        .enter().append("g")
        .attr("class", "axis-value");

    g_axis_value.selectAll("text")
        .data(build_radar_data)
        .enter().append("text")
        .attr("x", function (d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2) + d.dx; })
        .attr("y", function (d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2) + d.dy; })
        .attr("class", "text")
        .style("fill", (d) => VALUE_TEXT_COLORS[d.axis_index])
        .text(d => format_value(d.value));

    // helpers
    function build_radar_data(data, i) {
        return axis_data.map(item => {
            return Object.assign({ axis_index: i }, data[item.axis])
        });
    }

}