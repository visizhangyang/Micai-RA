import { Component } from '@angular/core'
import { NavController, NavParams } from 'ionic-angular'

import { PortfolioService } from 'services'
import { PurchaseRedeemPage } from '../trade';

@Component({
    selector: 'portfolio-detail-page',
    templateUrl: 'portfolio-detail.html'
})

export class PortfolioDetailPage {

    detailData: any[];
    collapseEnabled: boolean = false;
    targetsCollapsed: any;
    riskLevel: number;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private portfolioService: PortfolioService) {
        this.riskLevel = this.navParams.get('riskLevel');
        let defaultTargetCode = this.navParams.get('defaultTarget');
        this.collapseEnabled = true;
        this.initTargetsCollaspsed(true);
        this.targetsCollapsed[defaultTargetCode] = false;
        this.detailData = this.navParams.get('detailData');
    }

    initTargetsCollaspsed(collaspsed) {
        this.targetsCollapsed = {};
        for (let code of this.portfolioService.getTargetOrderList()) {
            this.targetsCollapsed[code] = collaspsed;
        }
    }

    onTargetClick(code) {
        if (this.collapseEnabled) {
            this.targetsCollapsed[code] = !this.targetsCollapsed[code];
        }
    }

    purchase() {
        this.navCtrl.push(PurchaseRedeemPage, { type: 'purchase', 'riskLevel': this.riskLevel });
    }

}