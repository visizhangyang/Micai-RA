import { Component, ElementRef, Input, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import moment from 'moment';
import numeral from 'numeral';
import { FormatMoneyPipe } from '../pipes';

declare var window: any

window.d3 = d3

const COLORS = ['#28BBE8', '#1580F3']
const time_now = d3.timeDay.offset(new Date(), -1)

@Component({
    selector: 'portfolio-history-graph',
    templateUrl: 'portfolio-history-graph.html',
    providers: [FormatMoneyPipe]
})
export class PortfolioHisotryGraphComponent {
    @Input("daily-return") daily_return: any;
    @Input("current-value") current_value: number;
    ready: boolean = false;
    container: any;
    margin: any;
    width: number;
    height: number;
    XAXIS_HEIGHT: number;
    X_TICKS_COUNT: number = 4;
    legend: Array<any>;
    period_list = [
        { value: d3.timeMonth.offset(time_now, -1), label: '1个月' },
        { value: d3.timeMonth.offset(time_now, -3), label: '3个月' },
        { value: d3.timeMonth.offset(time_now, -6), label: '6个月' },
        { value: d3.timeMonth.offset(time_now, -12), label: '1年' },
    ]
    current_period: any

    constructor(public element: ElementRef, public formatMoney: FormatMoneyPipe) {
        this.legend = [{
            label: '投资组合',
            color: COLORS[0],
        }, {
            label: '沪深300',
            color: COLORS[1],
        }]
        this.current_period = this.period_list[0]
    }

    ngOnInit() {
        this.container = d3.select(this.element.nativeElement).select('.container').node();
        const options = {
            top: 25,
            bottom: 15,
            left: 55,
            right: 15,
        }
        this.init(options);
        this.ready = true;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.ready) {
            this.draw(this.daily_return);
        }
    }

    ngAfterViewInit() {
        this.draw(this.daily_return);
    }

    changePeriod(item) {
        if (this.current_period == item) return;
        this.current_period = item;
        this.draw(this.daily_return);
    }

    init(options) {
        this.margin = {
            left: options.left || 15,
            top: options.top || 15,
            bottom: options.bottom || 0,
            right: options.right || 15,
        };
        this.width = this.container.clientWidth;
        this.height = options.height || 200;
        this.XAXIS_HEIGHT = 15;
    }

    createSVG() {
        d3.select(this.container).selectAll('svg').remove();
        const svg = d3.select(this.container).append('svg')
            .attr('class', 'd3-line-chart')
            .attr('width', this.width)
            .attr('height', this.height);


        svg.append("linearGradient")
            .attr("id", "portfolio-history-graph-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", 0)
            .attr("x2", 0).attr("y2", this.height)
            .selectAll("stop")
            .data([
                { offset: "0%", class: "offset-0" },
                { offset: "100%", class: "offset-100" }
            ])
            .enter().append("stop")
            .attr("offset", d => d.offset)
            .attr("class", d => d.class);

        svg.append("linearGradient")
            .attr("id", "benchmark-history-graph-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", 0)
            .attr("x2", 0).attr("y2", this.height)
            .selectAll("stop")
            .data([
                { offset: "0%", class: "benchmark-offset-0" },
                { offset: "100%", class: "benchmark-offset-100" }
            ])
            .enter().append("stop")
            .attr("offset", d => d.offset)
            .attr("class", d => d.class);

        svg.append("linearGradient")
            .attr("id", "rebalance-graph-gradient")
            .attr("gradientUnits", "objectBoundingBox")
            .attr("x1", 0).attr("y1", 0)
            .attr("x2", 0).attr("y2", 1)
            .selectAll("stop")
            .data([
                { offset: "0%", class: "offset-0" },
                { offset: "80%", class: "offset-80" },
                { offset: "100%", class: "offset-100" }
            ])
            .enter().append("stop")
            .attr("offset", d => d.offset)
            .attr("class", d => d.class);

        svg.append("linearGradient")
            .attr("id", "today-graph-gradient")
            .attr("gradientUnits", "objectBoundingBox")
            .attr("x1", 0).attr("y1", 0)
            .attr("x2", 0).attr("y2", 1)
            .selectAll("stop")
            .data([
                { offset: "0%", class: "offset-0" },
                { offset: "80%", class: "offset-80" },
                { offset: "100%", class: "offset-100" }
            ])
            .enter().append("stop")
            .attr("offset", d => d.offset)
            .attr("class", d => d.class);


        return svg;
    }

    draw(daily_return, transitionDuration = 0) {
        if (daily_return == null) return;
        const svg = this.createSVG();
        const margin = this.margin,
            availableWidth = this.width - this.margin.left - this.margin.right,
            chartViewHeight = this.height - margin.top - margin.bottom - this.XAXIS_HEIGHT;

        const startDate = d3.timeFormat('%Y-%m-%d')(this.current_period.value)

        // data = rebuildData(data, this.X_TICKS_COUNT, startDate)

        const startIndex = daily_return.days.findIndex(d => d > startDate)

        let data = {
            date: rebuild_data(daily_return.days, this.X_TICKS_COUNT, startIndex),
            historical_data: rebuild_data(daily_return.portfolio_returns, this.X_TICKS_COUNT, startIndex),
            benchmark_data: rebuild_data(daily_return.benchmark_returns, this.X_TICKS_COUNT, startIndex),
        }

        data = {
            date: data.date,
            historical_data: convert_log_ret(data.historical_data),
            benchmark_data: convert_log_ret(data.benchmark_data),
        }


        const valuesDomain = generateYAxisTickValues(data);

        const x = d3.scaleLinear().range([0, availableWidth]).domain([0, data.date.length - 1]);
        const y = d3.scaleLinear().range([chartViewHeight, 0]).domain(valuesDomain);
        const xTickValues = generateXAxisTickValues(data.date.length, this.X_TICKS_COUNT);

        const g_axis = svg.append('g').attr('class', 'g-axis');
        // --- lines view
        const g_chart = svg.append('g').attr('class', 'g-chart').attr('transform', `translate(${margin.left},${margin.top})`);

        const line = d3.line()
            .x((_, index) => x(index))
            .y(d => y(d));

        var area = d3.area()
            .x((_, index) => x(index))
            .y0(chartViewHeight)
            .y1(d => y(d));

        // const lineTransition = d3.transition()
        //     .duration(transitionDuration)
        //     .ease(d3.easeLinear);

        // render the lines with inverse order
        const historical_data = data.historical_data;

        const benchmark_data = data.benchmark_data;

        if (benchmark_data) {
            g_chart.append('path')
                .datum(benchmark_data)
                .attr('class', 'benchmark-area')
                .attr('d', area);

            g_chart.append('path')
                .datum(benchmark_data)
                .attr('class', 'benchmark-line')
                .attr('d', line);
        }


        g_chart.append('path')
            .datum(historical_data)
            .attr('class', 'area')
            .attr('d', area);

        g_chart.append('path')
            .datum(historical_data)
            .attr('class', 'line')
            .attr('d', line);


        //--- axis view x-axis

        const dateFormat = d3.timeFormat('%Y/%-m/%-d');
        const xAxisTextFormatter = (index) => dateFormat(new Date(data.date[index]));
        // const xAxisTickScale = d3.scaleLinear().domain([10, 100]).range([])

        const xAxisMarginTop = this.height - margin.bottom - this.XAXIS_HEIGHT;
        const xAxis = d3.axisBottom().scale(x).tickPadding(10).ticks(3).tickSizeInner(-xAxisMarginTop).tickSizeOuter(0).tickFormat(xAxisTextFormatter).tickValues(xTickValues);
        const xAxisView = g_axis.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(${margin.left},${xAxisMarginTop})`)
            .call(xAxis);
        //xAxisView.selectAll('.tick text').attr('x', 26);


        //--- axis view y-axis
        const yAxisTextFormatter = d3.format('.2%');
        const yAxis = d3.axisRight().scale(y).ticks(4).tickSize(availableWidth + 41).tickFormat(v => yAxisTextFormatter(v));
        // const yAxisMarginLeft = this.width - margin.right;
        const yAxisView = g_axis.append('g')
            .attr('class', 'y axis')
            .attr('transform', `translate(${margin.left - 41},${margin.top})`)
            .call(yAxis);

        yAxisView.selectAll('g.tick').selectAll('text').attr('x', 41 - 1).attr('y', -7);

        // 当前市值

        if (this.current_value) {
            const txt = numeral(this.current_value).format('0,0.00')
            g_chart.append('text').attr('class', 'current-value').text('￥' + txt).attr('x', availableWidth).attr('y', -10)
        }

        //---- operations
        const g_operations = svg.append('g').attr('class', 'g-operations');

        let operations = getValidOperations(daily_return.operations, startDate)
        // console.log(operations)
        // operations = [
        //     { "date": "2016-09-14", "action": "首次买入" },
        //     { "date": "2016-11-30", "action": "卖出" },
        //     { "date": "2017-01-05", "action": "优化" },
        //     { "date": "2017-02-01", "action": "卖出" },
        //     { "date": "2017-03-10", "action": "买入" },
        //     { "date": "2017-03-15", "action": "优化" },
        //     { "date": "2017-04-12", "action": "今日" },
        // ]

        const operation_box = `
            <path d="M27,10.5 L27,2.00276013 C27,0.893542647 26.1012878,0 24.9926701,0 L2.00732994,0 C0.898338318,0 0,0.896666251 0,2.00276013 L0,10.9972399 C0,12.1064574 0.898712226,13 2.00732994,13 L23.5,13 L29,15 L27,10.5 Z"></path>
        `

        const operation_flag = {
            'buy_first': true,
            'sell_first': true,
            'rebalance_first': true,
        }

        for (let { date, action } of operations) {
            const x_index = data.date.findIndex(p => date == p)
            if (x_index < 0) continue

            const pos_x = x(x_index) + margin.left
            const pos_y = y(data.historical_data[x_index]) + margin.top
            const pos_y_bottom = this.height - margin.bottom - this.XAXIS_HEIGHT - pos_y

            const g_operation = g_operations.append('g').attr('class', 'operation')
                .attr('transform', `translate(${pos_x},${pos_y})`)

            const tips = g_operation.append('g').html(operation_box)

            const operation_circle = g_operation.append('circle').attr('cx', -0.1).attr('cy', 0)

            const text = tips.append('text').attr('x', '-5px').attr('y', '-7px')

            let show_tips = false

            if (action == '首次买入' || action == '买入') {
                operation_circle.attr('r', 2.5).attr('fill', '#FF2D55')
                if (operation_flag.buy_first) {
                    text.text('买入')
                    operation_circle.attr('r', 2)
                    operation_flag.buy_first = false
                    show_tips = true
                }

            } else if (action == '卖出') {
                operation_circle.attr('r', 2.5).attr('fill', '#4CD964')
                if (operation_flag.sell_first) {
                    text.text('卖出')
                    operation_circle.attr('r', 2)
                    operation_flag.sell_first = false
                    show_tips = true
                }
            } else if (action == '优化') {
                operation_circle.attr('r', 2.5).attr('fill', '#1580F3')
                g_operation.append('line').attr('class', 'rebalance').attr('x1', -0.1).attr('y1', '2').attr('x2', 0).attr('y2', pos_y_bottom)
                if (operation_flag.rebalance_first) {
                    text.text('优化')
                    operation_circle.attr('r', 2)
                    operation_flag.rebalance_first = false
                    show_tips = true
                }
            } else if (action == '今日') {
                g_operation.select('path').style('display', 'none')
                operation_circle.attr('r', 2.5).attr('fill', '#5AC8FA')
                g_operation.append('line').attr('class', 'today').attr('x1', -0.1).attr('y1', '2.5').attr('x2', 0).attr('y2', pos_y_bottom)
                g_operation.append('text').attr('class', 'today-text').attr('x', -2).attr('y', pos_y_bottom - 16).text('今日')
            }

            if (!show_tips) {
                tips.style('display', 'none')
            }
        }
    }

}

function getValidOperations(operations, startDate) {
    const result = []
    for (let date in operations) {
        if (date > startDate) {
            result.push({ date, action: operations[date] })
        }
    }

    result.sort((first, second) => { return first.date < second.date ? -1 : (first.date == second.date ? 0 : 1); });
    const today = d3.timeFormat('%Y-%m-%d')(new Date)
    result.push({ date: today, action: '今日' })
    return result
}

function generateXAxisTickValues(total, count) {

    const mid = Math.round(total / 2) - 1
    const last = total - 1

    if (total % 3 == 0) {
        return [0, mid, last]
    } else if (total > 14) {
        return [0, mid, last]
    } else {
        return [0, total - 1]
    }

    // switch (total) {
    //     case 3: return [1];
    //     case 4: return [1, 2];
    //     case 5: return [1, 2, 3];
    //     case 6: return [1, 2, 3, 4];
    //     case 7: return [2, 4];
    //     case 8: return [2, 5];
    //     case 9: return [1, 3, 5, 7];
    //     case 10: return [3, 6];
    //     case 11: return [2, 5, 8];
    //     case 12: return [3, 7];
    //     case 13: return [3, 6, 9];
    //     case 14: return [4, 9];
    // }

    // const values = [];

    // for (let i = 0; i < count; i++) {
    //     values.push(Math.round(total / (count + 1) * (i + 1)));
    // }


    // return values;
}


function generateYAxisTickValues({ historical_data, benchmark_data }) {
    const [start1, end1] = d3.extent(historical_data);
    let [start2, end2] = [0, 0];
    if (benchmark_data) {
        [start2, end2] = d3.extent(benchmark_data);
    }
    const start = Math.min(start1, start2), end = Math.max(end1, end2)
    if (start === 0 && end === 0) {
        return [-1, 1];
    } else if (start === end) {
        return [start / 2, end * 1.5];
    } else {
        return [start, end];
    }
}

/*
    为了数据更好的显示，特别是少量数据时，需要对原数据形式进行调整
*/
function rebuild_data(data, xTickCount, startIndex) {

    if (data == null || data.length == 0) return null

    if (startIndex > 0) {
        data = data.slice(startIndex)
    }
    const first = data[0]
    const last = data[data.length - 1]
    if (data.length <= xTickCount) {
        //填充首尾
        return [first].concat(data).concat([last])
    } else if (data.length === xTickCount + 1) {
        //填充首部
        return [first].concat(data)

    } else {
        //不填充
        return data
    }
}

function convert_log_ret(data) {
    if (data == null || data.length == 0) return null
    let total = 0
    const result = data.map((item, index) => {
        if (index == 0) return 0
        total += item
        return Math.exp(total) - 1
    })
    // np.exp(log_ret.cumsum()) -1
    // console.log(result)
    return result
}