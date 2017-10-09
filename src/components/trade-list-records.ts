import { Component, ElementRef, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular'

import { TradeDetailPage } from '../pages/trade'

@Component({
    selector: 'trade-list-records',
    templateUrl: 'trade-list-records.html',
})

export class TradeListRecordsComponent {
    @Input() data: any;

    constructor(public element: ElementRef, public navCtrl: NavController) {
    }

    viewDetail(tradeRecord) {
        this.navCtrl.push(TradeDetailPage, { orderPlanId: tradeRecord.id })
    }
}
