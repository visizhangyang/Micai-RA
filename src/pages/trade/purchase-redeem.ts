import { Component } from '@angular/core'
import { NavController, NavParams } from 'ionic-angular'

import { PortfolioService, RALoadingController } from 'services'
import { ComplianceConfirmPage } from './compliance-confirm'

@Component({
    selector: 'purchase-redeem-page',
    templateUrl: 'purchase-redeem.html'
})

export class PurchaseRedeemPage {

    type: string;
    displayType: string;
    riskLevel: number;
    portfolioId: number;
    accountBalance: number = 50000;
    minPurchaseAmount = 20000;
    minAppendAmount = 5000;
    purchaseAmount: number;
    minBalanceAmount = 10000;
    assetBalance: number;
    redeemAmount: number;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private portfolioService: PortfolioService,
        private loadingCtrl: RALoadingController,
    ) {
        this.type = this.navParams.get('type') || 'purchase';
        this.displayType = (this.type === 'purchase' || this.type === 'append') ? 'purchase' : 'redeem';
        this.riskLevel = this.navParams.get('riskLevel');
        this.portfolioId = this.navParams.get('portfolioId');
        this.loadingCtrl.loading(this.getPortfolio.bind(this))
    }

    getPortfolio() {
        if (this.portfolioId != null) {
            return this.portfolioService.getPortfolio(this.portfolioId).then((result) => {
                this.assetBalance = Math.round(result.general_info.current_value * 100) / 100;
            });
        }
    }

    isReedemAllRequired() {
        return this.assetBalance != this.redeemAmount && this.assetBalance - this.redeemAmount < this.minBalanceAmount;
    }

    reedemAll() {
        this.redeemAmount = this.assetBalance;
    }

    canPurchase() {
        if (this.type == 'purchase') {
            return this.purchaseAmount != null && this.purchaseAmount >= this.minPurchaseAmount && this.purchaseAmount <= this.accountBalance
        } else if (this.type == 'append') {
            return this.purchaseAmount != null && this.purchaseAmount >= this.minAppendAmount && this.purchaseAmount <= this.accountBalance
        }
    }

    confirm() {
        if (this.type === 'purchase') {
            this.navCtrl.push(ComplianceConfirmPage, { complianceType: 'purchase', riskLevel: this.riskLevel, amount: this.purchaseAmount });
        }
        else if (this.type === 'append') {
            this.navCtrl.push(ComplianceConfirmPage, { complianceType: 'append', portfolioId: this.portfolioId, amount: this.purchaseAmount });
        }
        else if (this.type === 'redeem') {
            if (this.assetBalance == this.redeemAmount) {
                this.navCtrl.push(ComplianceConfirmPage, { complianceType: 'redeem_all', portfolioId: this.portfolioId });
            }
            else {
                this.navCtrl.push(ComplianceConfirmPage, { complianceType: 'redeem', portfolioId: this.portfolioId, amount: this.redeemAmount });
            }
        }
    }

}
