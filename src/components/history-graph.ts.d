import { Component, ElementRef, Input } from '@angular/core';
import { RaPercentPipe } from '../pipes';
import * as d3 from 'd3';

import { HistoryService } from 'services'

@Component({
    selector: 'history-graph',
    templateUrl: 'history-graph.html',
    providers: [RaPercentPipe],
})

export class HisotryGraphComponent {
    @Input() riskLevel: number;
    datePickerList: any[];
    selectedPicker: any;
    defaultPeriod: string = '1m';
    options: any;
    raData: any[];
    indexData: any[];
    svg: any;
    getX: any;
    getY: any;
    xAxis: any;
    yAxis: any;
    valueLine: any;
    area: any;
    isDomSetup = false;

    constructor(public element: ElementRef, private raPercentPipe: RaPercentPipe, private historyService: HistoryService) {
        this.datePickerList = [
            { text: '1个月', period: '1m' },
            { text: '3个月', period: '3m' },
            { text: '6个月', period: '6m' },
            { text: '1年', period: '1y' }
        ];
    }

    ngOnInit() {
        this.selectPicker(this.defaultPeriod);
        this.options = {
            height: 260,
            width: d3.select(this.element.nativeElement).node().clientWidth - 32,
            margin: {
                left: 41,
                right: 0,
                top: 0,
                bottom: 40
            }
        }
        this.setupDom();
        this.getHistoryRate();
    }

    ngOnChanges(changes) {
        let riskLevel = changes.riskLevel;
        if (riskLevel && riskLevel.currentValue && this.isDomSetup) {
            this.getHistoryRate();
        }
    }

    selectPicker(period) {
        for (let picker of this.datePickerList) {
            picker.active = picker.period === period;
            if (picker.active) {
                this.selectedPicker = picker;
            }
        }
    }

    pick(picker) {
        this.selectPicker(picker.period);
        this.getHistoryRate();
    }

    getHistoryRate() {
        if (this.riskLevel && this.selectedPicker) {
            let formatDate = d3.timeFormat("%Y-%m-%d");
            let current = new Date();
            let startDate = formatDate(this.getStartDate(current, this.selectedPicker.period));
            let endDate = formatDate(current);

            let promiseRa = this.historyService.getReturn(this.riskLevel, startDate, endDate).then((result) => {
                this.raData = [];
                for (let i = 0; i < result.date.length; i++) {
                    let dateStr = result.date[i];
                    let value = result.historical_data[i];
                    this.raData.push({ date: new Date(dateStr), value: value });
                }
            });

            let promiseIndex = this.historyService.getIndexReturn('HS300净值', startDate, endDate).then((result) => {
                this.indexData = [];
                for (let i = 0; i < result.date.length; i++) {
                    let dateStr = result.date[i];
                    let value = result.historical_pricing['HS300净值'][i];
                    this.indexData.push({ date: new Date(dateStr), value: value });
                }
            });

            Promise.all([promiseRa, promiseIndex]).then(() => {
                this.draw(this.raData, this.indexData);
            });
        }
    }

    getStartDate(baseDate, period: string) {
        let result = new Date(baseDate);
        if (period === '1m' || period === '3m' || period === '6m') {
            let monthDiff = 0;
            if (period === '1m') {
                monthDiff = -1;
            }
            else if (period === '3m') {
                monthDiff = -3;
            }
            else if (period === '6m') {
                monthDiff = -6;
            }

            result.setMonth(result.getMonth() + monthDiff);
        }
        else if (period === '1y') {
            result.setFullYear(result.getFullYear() - 1);
        }

        return result;
    }

    setupDom() {
        let options = this.options;

        this.getX = d3.scaleTime().range([this.options.margin.left, this.options.width - this.options.margin.right]);
        this.getY = d3.scaleLinear().range([this.options.height - this.options.margin.bottom, this.options.margin.top]);

        let xParser = d => { return this.getX(d.date); };
        let yParser = d => { return this.getY(d.value); };
        this.valueLine = d3.line()
            .x(xParser)
            .y(yParser);

        this.svg = d3.select(this.element.nativeElement).insert('svg', ':nth-child(2)')
            .attr('class', 'container')
            .attr('width', options.width)
            .attr('height', options.height + 35);

        this.svg.append('g')
            .attr("transform", "translate(0," + (options.height - options.margin.bottom) + ")")
            .attr('class', 'x-axis-g axis-g');

        this.svg.append('g').attr('class', 'y-axis-g axis-g');

        this.svg.append('path').attr('class', 'performance-line');
        this.svg.append('path').attr('class', 'index-line');

        this.setupArea('performance-area', 'hist-graph-gradient');
        this.setupArea('index-area', 'index-hist-graph-gradient');

        this.xAxis = d3.axisBottom()
            .tickPadding(10)
            .tickSizeInner(0)
            .scale(this.getX);

        this.yAxis = d3.axisLeft()
            .tickFormat(d => this.raPercentPipe.transform(d - 1))
            .ticks(4)
            .tickPadding(0)
            .tickSizeInner(-(options.width - options.margin.left + 41))
            .scale(this.getY);

        this.area = d3.area()
            .x(xParser)
            .y1(yParser)
            .y0(options.height - options.margin.bottom);

        var legendContainer = this.svg.append('g').attr('class', 'legend');
        var legend = legendContainer
            .selectAll('g')
            .data(['投资组合', '沪深300'])
            .enter()
            .append('g')
            .attr('transform', function (name, index) {
                let x = 110 + index * 90;
                let y = options.height - options.margin.bottom + 41;
                return `translate(${x}, ${y})`;
            });

        legend.append('rect')
            .attr('x', 0)
            .attr('y', 8)
            .attr('width', 11)
            .attr('height', 4)
            .attr('rx', 1)
            .attr('fill', function (name, index) {
                if (index == 0) {
                    return '#28BBE8';
                }
                else if (index == 1) {
                    return '#1580F3';
                }
            });

        legend.append('text')
            .attr('x', 16)
            .attr('y', 10)
            .attr('dy', '0.32em')
            .text(function (d) { return d; });


        this.isDomSetup = true;
    }

    setupArea(areaName, gradientName) {
        let areaG = this.svg.append('g');
        let linear = areaG.append('defs')
            .append('linearGradient')
            .attr('id', gradientName)
            .attr('x2', '0')
            .attr('y2', '1');
        linear.append('stop')
            .attr('class', 'top-stop')
            .attr('offset', '0%');

        linear.append('stop')
            .attr('class', 'bottom-stop')
            .attr('offset', '100%');

        areaG.append('path').attr('class', areaName);
    }

    draw(raData, indexData) {
        this.getX.domain(d3.extent(raData, function (d) { return d.date; }));
        let unionData = raData.concat(indexData);
        this.getY.domain(d3.extent(unionData, function (d) { return d.value; }));

        let tickValues = this.getTickValues(raData, this.selectedPicker.period);
        let currentPeriodFormat = this.getPeriodDateFormat(this.selectedPicker.period);

        this.xAxis
            .tickFormat(function (d) {
                return currentPeriodFormat(d);
            })
            .tickValues(tickValues);
        this.svg.select('.x-axis-g').call(this.xAxis);

        this.svg.select('.y-axis-g').call(this.yAxis);
        this.svg.selectAll('.y-axis-g .tick text').attr('x', '40px').attr('dy', '1.1em');

        this.svg.select(".performance-line")
            .data([raData])
            .attr("d", this.valueLine);

        this.svg.select(".index-line")
            .data([indexData])
            .attr("d", this.valueLine);

        this.svg.select('.performance-area')
            .data([raData])
            .attr('d', this.area)
            .style('fill', 'url(#hist-graph-gradient)');

        this.svg.select('.index-area')
            .data([indexData])
            .attr('d', this.area)
            .style('fill', 'url(#index-hist-graph-gradient)');
    }

    getTickValues(data, activePeriod) {
        var ticksCount = 3;
        if (data.length === 0) {
            return [];
        }

        let start: any = data[0].date;
        let end: any = data[data.length - 1].date;
        let mid = data[Math.round(data.length / 2) - 1].date;

        // var factor = (end - start) / (ticksCount + 1);
        // var values = [];
        // for (var i = start.getTime() + factor; i < end.getTime(); i += factor) {
        //     values.push(new Date(i));
        // }

        if (data.length % 3 == 0) {
            return [start, mid, end]
        } else if (data.length > 14) {
            return [start, mid, end]
        } else {
            return [start, end]
        }
    };

    getPeriodDateFormat(period: string) {
        let defaultTickDateFormat = d3.timeFormat("%Y/%-m/%-d");
        let periodDateFormatMap = {
            '1m': defaultTickDateFormat,
            '3m': defaultTickDateFormat,
            '6m': defaultTickDateFormat,
            '1y': defaultTickDateFormat
        };

        return periodDateFormatMap[period];
    }

}
