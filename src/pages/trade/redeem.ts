import { Component } from '@angular/core'
import { NavController, NavParams } from 'ionic-angular'

import { PortfolioService } from 'services'
import { ComplianceConfirmPage } from './compliance-confirm'

@Component({
    selector: 'redeem-page',
    templateUrl: 'redeem.html'
})

export class RedeemPage {

    availableBalance: number = 0;
    minBalanceAmount = 10000;
    redeemAmount: number;
    portfolioId: number;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private portfolioService: PortfolioService) {
        this.portfolioId = this.navParams.get('portfolioId');
        this.getPortfolio();
    }

    getPortfolio() {
        if (this.portfolioId != null) {
            this.portfolioService.getPortfolio(this.portfolioId).then((result) => {
                this.availableBalance = Math.round(result.general_info.current_value * 100) / 100;
            });
        }
    }

    redeemAmountAll() {
        this.redeemAmount = this.availableBalance;
    }

    isReedemAllRequired() {
        return this.availableBalance - this.redeemAmount < this.minBalanceAmount;
    }

    redeem() {
        this.navCtrl.push(ComplianceConfirmPage, { complianceType: 'redeem', portfolioId: this.portfolioId, amount: this.redeemAmount });
    }

    redeemAll() {
        this.navCtrl.push(ComplianceConfirmPage, { complianceType: 'redeem_all', portfolioId: this.portfolioId });
    }

}
