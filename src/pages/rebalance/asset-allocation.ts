import { Component } from '@angular/core'
import { NavController, NavParams, Tabs } from 'ionic-angular'

import { PortfolioService } from 'services'
import { DonutComponent } from '../../components'
import { PortfolioDetailPage } from '../wealth-mgmt'

@Component({
    selector: 'asset-allocation-page',
    templateUrl: 'asset-allocation.html'
})

export class AssetAllocationPage {

    needAdjust: boolean = false;
    portfolioId: number;
    allocationDate: Date = new Date();
    donutData: any[];
    rebalancePlanData: any;
    rebalanceList: any[];
    detailData: any[];

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private portfolioService: PortfolioService) {
        this.portfolioId = this.navParams.get('portfolioId');
        this.getPortfolioRebalance();
    }

    getPortfolioRebalance() {
        this.portfolioService.getRebalance(this.portfolioId).then(
            (result) => {
                if (result && result.rebalance_plan) {
                    this.rebalancePlanData = result;
                    this.needAdjust = true;
                    this.setData();
                }
            }
        );
    }

    setData() {
        this.donutData = [];
        this.rebalanceList = [];
        this.detailData = [];

        let rebalancePlan = this.rebalancePlanData.rebalance_plan;
        Object.keys(rebalancePlan).forEach(key => {
            this.donutData.push({ code: key, percentage: rebalancePlan[key].suggest });
            this.rebalanceList.push({ code: key, suggest: rebalancePlan[key].suggest, adjust: rebalancePlan[key].adjust });
            this.detailData.push({ code: key, products: rebalancePlan[key].products });
        });

        let orderList = this.portfolioService.getTargetOrderList();
        this.donutData.sort((first, second) => orderList.indexOf(first.code) - orderList.indexOf(second.code));
        this.rebalanceList.sort((first, second) => orderList.indexOf(first.code) - orderList.indexOf(second.code));
        this.detailData.sort((first, second) => orderList.indexOf(first.code) - orderList.indexOf(second.code));
    }

    doRebalance() {
        this.portfolioService.doRebalance(this.portfolioId).then(
            (result) => {
                this.navCtrl.popToRoot();
                var t: Tabs = this.navCtrl.parent;
                t.select(1);
            }
        );
    }

    viewDetail(code) {
        this.navCtrl.push(PortfolioDetailPage, { defaultTarget: code, detailData: this.detailData });
    }
}
