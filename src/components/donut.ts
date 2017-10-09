import { Component, ElementRef, Input } from '@angular/core';
import { RaPercentPipe } from '../pipes';
import * as d3 from 'd3';
import * as d3select from 'd3-selection';

@Component({
    selector: 'donut',
    templateUrl: 'donut.html',
    providers: [RaPercentPipe],
})

export class DonutComponent {
    @Input() data: any;
    arc: any;
    labelArc: any;
    svg: any;
    group: any;
    pie: any;
    arcTween: any;
    current: any;

    constructor(public element: ElementRef, private raPercentPipe: RaPercentPipe) {
    }

    ngOnInit() {
    }

    ngOnChanges(changes) {
        let data = changes.data;
        if (data && data.currentValue) {
            this.setupDOM();
            this.draw(data.currentValue);
        }
    }

    setupDOM() {
        const container = d3.select(this.element.nativeElement);
        container.select('svg').remove();

        const size = container.node().clientHeight;

        let innerRadius = size * 0.3125;
        let outerRadius = size * 0.5;

        const arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        this.labelArc = arc;

        this.svg = container.append('svg')
            .attr('width', size)
            .attr('height', size);

        this.group = this.svg.append('g')
            .attr('transform', `translate(${size / 2}, ${size / 2})`);

        this.pie = d3.pie().sort(null).value((d) => d.percentage);

        this.arcTween = function arcTween(a) {
            const i = d3.interpolate(this.current, a);
            return t => arc(i(t));
        };

    }

    draw(data) {
        const t = d3.transition()
            .delay(500)
            .duration(1000);

        this.group.selectAll('.arc').remove();
        const arc = this.group.selectAll('.arc')
            .data(this.pie(data))
            .enter().append('g')
            .attr('class', 'arc');

        const path = arc
            .append('path')
            .attr('class', (d) => d.data.code)
            .each(function setupCurrent() {
                this.current = { startAngle: 0, endAngle: 0 };
            });

        const text = arc.append('text')
            .each(function setupCurrent() {
                this.current = { startAngle: 0, endAngle: 0 };
            })
            .attr('opacity', 0)
            .attr('transform', (d) => `translate(${this.labelArc.centroid(d)})`);
        text.append('tspan').text((d) => this.transAsset(d.data.code));


        var percentageText = text.append('tspan')
            .text((d) => {
                if (d.data.percentage < 0.02) {
                    return '';
                }
                return this.raPercentPipe.transform(d.data.percentage);;
            });
        percentageText.attr('x', 0).attr('dy', '1.1em');

        path.transition(t)
            .attrTween('d', this.arcTween);

        text.transition(t)
            .attr('opacity', 1);
    }

    transAsset(text) {
        const translation = {
            FIXED_INCOME: '固收类',
            STOCK: '股票类',
            ALTERNATIVE: '另类投资',
            CASH: '现金类',
        };
        return translation[text] || text;
    }

}
