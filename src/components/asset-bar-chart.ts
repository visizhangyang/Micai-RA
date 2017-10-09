import { Component, ElementRef, Input } from '@angular/core';

@Component({
    selector: 'asset-bar-chart',
    templateUrl: 'asset-bar-chart.html',
})

export class AssetBarChartComponent {
    @Input() data: any;

    constructor(public element: ElementRef) {
    }


    ngOnChanges(changes) {
        let data = changes.data;
        if (data && data.currentValue) {
            let nativeEl = this.element.nativeElement;
            setTimeout(() => {
                let barEls = nativeEl.getElementsByClassName('bar');
                for (let barEl of barEls) {
                    let width = this.calcBarWidth(barEl, parseFloat(barEl.dataset.percentage));

                    let svgs = barEl.getElementsByTagName('svg');
                    if (svgs.length > 0) {
                        svgs[0].setAttribute('width', width + 'px');
                    }

                    let rects = barEl.getElementsByTagName('rect');
                    if (rects.length > 0) {
                        rects[0].setAttribute('width', width);
                    }
                }
            }, 100);
        }
    }

    calcBarWidth(barEl, percentage) {
        let totalWidth = barEl.clientWidth;
        let resultWidth = 0;
        if (isNaN(percentage)) {
            percentage = 0;
        }

        if (percentage <= 0.5) {
            resultWidth = Math.round(totalWidth * 0.9 * (percentage / 0.5));
        }
        else {
            resultWidth = Math.round(totalWidth * 0.9 + totalWidth * 0.1 * ((percentage - 0.5) / 0.5));
        }

        return resultWidth;
    }


}
