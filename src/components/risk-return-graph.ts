import { Component, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';

import { RaPercentPipe } from '../pipes';

@Component({
    selector: 'risk-return-graph',
    templateUrl: 'risk-return-graph.html',
    providers: [RaPercentPipe]
})

export class RiskReturnGraphComponent {
    @Input() data: any;
    svg: any;
    g: any;
    rateG: any;
    arc1: any;
    arc1_2: any;
    arc2: any;
    arc3: any;
    retunRateSvgText: any;
    volatilityRateSvgText: any;
    riskLevelSvgText: any;
    riskLevelColors = ['#0291ff', '#1ba2ff', '#3fbbff', '#62d2fc', '#8ac7bc',
        '#afbc82', '#d7b141', '#ffa400', '#ff7121', '#fa5534'];
    riskLevelTextSvgText: any;

    constructor(public element: ElementRef, private raPercentPipe: RaPercentPipe) {
    }

    ngOnInit() {
        this.setupDOM();
    }

    ngOnChanges(changes) {
        let data = changes.data;
        if (data && data.currentValue) {
            this.draw(data.currentValue);
        }
    }

    setupDOM() {
        const container = d3.select(this.element.nativeElement);

        const size = 240;
        this.svg = container.append('svg').attr('width', size).attr('height', size);

        let outerRadius = 108;
        let arcThickness = 6;
        let arcGap = 6
        let cornerRadius = 3;

        this.arc1 = d3.arc()
            .outerRadius(outerRadius)
            .innerRadius(outerRadius - arcThickness)
            .cornerRadius(cornerRadius)
            .startAngle(0);
        this.arc1_2 = d3.arc()
            .outerRadius(outerRadius)
            .innerRadius(outerRadius - arcThickness)
            .cornerRadius(cornerRadius)
            .startAngle(0.66 * (Math.PI * 2 * 0.75));

        this.arc2 = d3.arc()
            .outerRadius(outerRadius - arcThickness - arcGap)
            .innerRadius(outerRadius - arcThickness * 2 - arcGap)
            .cornerRadius(cornerRadius)
            .startAngle(0);

        this.arc3 = d3.arc()
            .outerRadius(outerRadius - arcThickness * 2 - arcGap * 2)
            .innerRadius(outerRadius - arcThickness * 3 - arcGap * 2)
            .cornerRadius(cornerRadius)
            .startAngle(0);

        this.g = this.svg
            .append('g')
            .attr('transform', `translate(${size / 2}, ${size / 2})`);

        this.rateG = this.svg.append('g');
        this.retunRateSvgText = this.setupRateText(30, '历史年化收益率', 'return-rate');
        this.volatilityRateSvgText = this.setupRateText(45, '历史年化波动率', 'volatility-rate');

        this.riskLevelTextSvgText = this.rateG
            .append('text')
            .attr('x', 30)
            .attr('y', 80)
            .attr('class', 'risk-level-text');

        this.riskLevelSvgText = this.g
            .append('text')
            .attr('class', 'risk-level')
            .attr('dy', '0.3em');
    }

    setupRateText(y, nameText, valueClass) {
        let rateSvgText = this.rateG
            .append('text')
            .attr('y', y)
            .attr('class', 'rate');

        rateSvgText.append('tspan')
            .attr('class', 'name')
            .text(nameText);

        rateSvgText.append('tspan')
            .attr('class', 'value ' + valueClass)
            .attr('dx', '0.5em');

        return rateSvgText;
    }

    draw(data) {
        this.g.selectAll('defs').remove();
        this.g.selectAll('path').remove();

        this.drawArc1(data);
        this.drawArc(data.riskLevel / 10 * 0.9, this.arc2, '#4694CD');
        this.drawArc(data.riskLevel / 10 * 0.8, this.arc3, '#5CB9FA');

        this.retunRateSvgText
            .select('.return-rate')
            .text(this.raPercentPipe.transform(data.returnRate));

        this.volatilityRateSvgText
            .select('.volatility-rate')
            .text(this.raPercentPipe.transform(data.volatilityRate));

        this.riskLevelTextSvgText
            .attr('fill', this.riskLevelColors[data.riskLevel - 1])
            .text(data.riskLevelText);

        this.riskLevelSvgText
            .attr('fill', this.riskLevelColors[data.riskLevel - 1])
            .text(data.riskLevel);
    }

    drawArc1(data) {
        let originColors = ['#0291FF', '#47DD6B', '#FFA500', '#FA5534']
        if (data.riskLevel <= 6) {
            let stops = [
                { offset: '0%', color: originColors[0] },
                { offset: '34%', color: originColors[1] },
                { offset: '67%', color: originColors[2] },
                { offset: '100%', color: originColors[3] }
            ]
            this.addGradient('gradient1', '0%', '100%', stops);
            this.drawArc(data.riskLevel / 10, this.arc1, 'url(#gradient1)');
        }
        else {
            let stops1 = [
                { offset: '0%', color: originColors[0] },
                { offset: '50%', color: originColors[1] },
                { offset: '100%', color: originColors[2] }
            ]

            let stops2 = [
                { offset: '0%', color: originColors[2] },
                { offset: '100%', color: originColors[3] }
            ]

            if (data.riskLevel == 7) {
                stops1 = [
                    { offset: '0%', color: originColors[0] },
                    { offset: '45%', color: originColors[1] },
                    { offset: '90%', color: originColors[2] },
                    { offset: '100%', color: this.riskLevelColors[9] }
                ]

                stops2 = [
                    { offset: '0%', color: this.riskLevelColors[9] },
                    { offset: '100%', color: originColors[3] }
                ]
            }
            else if (data.riskLevel == 8) {
                stops1 = [
                    { offset: '0%', color: originColors[0] },
                    { offset: '40%', color: originColors[1] },
                    { offset: '80%', color: originColors[2] },
                    { offset: '100%', color: this.riskLevelColors[8] }
                ]

                stops2 = [
                    { offset: '0%', color: this.riskLevelColors[8] },
                    { offset: '100%', color: originColors[3] }
                ]
            }

            this.addGradient('gradient1', '0%', '100%', stops1);
            this.drawArc(0.67, this.arc1, 'url(#gradient1)');

            this.addGradient('gradient2', '100%', '0%', stops2);
            this.drawArc(data.riskLevel / 10, this.arc1_2, 'url(#gradient2)');
        }
    }

    addGradient(id, y1, y2, stops) {
        let defs = this.g.append("svg:defs")
        let gradient = defs.append("svg:linearGradient")
            .attr("id", id)
            .attr("x1", "0%")
            .attr("y1", y1)
            .attr("x2", "0%")
            .attr("y2", y2)
            .attr("spreadMethod", "pad");

        for (let stop of stops) {
            gradient.append("svg:stop")
                .attr("offset", stop.offset)
                .attr("stop-color", stop.color)
                .attr("stop-opacity", 1);
        }
    }

    drawArc(ratio, arc, color) {
        if (ratio > 1) {
            ratio = 1;
        }

        let endAngle = ratio * (Math.PI * 2 * 0.75);
        arc.endAngle(endAngle);
        this.g.append('path')
            .attr('fill', color)
            .attr('d', arc);
    }

}
