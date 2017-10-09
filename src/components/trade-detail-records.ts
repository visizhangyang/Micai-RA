import { Component, Input } from '@angular/core';

@Component({
    selector: 'trade-detail-records',
    templateUrl: 'trade-detail-records.html',
})

export class TradeDetailRecordsComponent {
    @Input() data: any;

    constructor() {
    }

}
