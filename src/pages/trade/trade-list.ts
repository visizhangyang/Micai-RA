import { Component } from '@angular/core'
import { NavController, NavParams } from 'ionic-angular'

import { PortfolioService } from 'services'

@Component({
    selector: 'trade-list-page',
    templateUrl: 'trade-list.html'
})

export class TradeListPage {

    portfolioId: number;
    processingList: any[] = [];
    completedList: any[] = [];

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private portfolioService: PortfolioService) {
        this.portfolioId = this.navParams.get('portfolioId');
        this.getTradeData();
    }

    getTradeData() {
        if (this.portfolioId != null) {
            this.portfolioService.getOrderPlansByPortfolio(this.portfolioId).then(
                result => this.processOrderPlanResult(result)
            );
        }
        else {
            this.portfolioService.getOrderPlans().then(result => this.processOrderPlanResult(result));
        }
    }

    processOrderPlanResult(result) {
        let results = result.results;
        this.processingList = [];
        this.completedList = [];
        for (let tradeRecord of results) {
            tradeRecord.created = new Date(tradeRecord.created);
            if (tradeRecord.status == 'ORDERING') {
                this.processingList.push(tradeRecord);
            }
            else if (tradeRecord.status == 'DONE') {
                this.completedList.push(tradeRecord);
            }
        }
    }

}
