import { Component } from '@angular/core'
import { NavController, NavParams } from 'ionic-angular'

import { ComplianceConfirmPage } from './compliance-confirm'

@Component({
    selector: 'purchase-page',
    templateUrl: 'purchase.html'
})

export class PurchasePage {

    balance: number = 50000;
    riskLevel: number;
    purchaseAmount: number;
    purchaseType: string;
    minAmount = 20000;
    portfolioId: number;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.riskLevel = this.navParams.get('riskLevel');
        this.purchaseType = this.navParams.get('purchaseType');
        this.portfolioId = this.navParams.get('portfolioId');
        if (this.purchaseType === 'append') {
            this.minAmount = 5000;
        }
    }

    confirm() {
        if (this.purchaseType === 'append') {
            this.navCtrl.push(ComplianceConfirmPage, { complianceType: 'append', portfolioId: this.portfolioId, amount: this.purchaseAmount });
        }
        else {
            this.navCtrl.push(ComplianceConfirmPage, { complianceType: 'purchase', riskLevel: this.riskLevel, amount: this.purchaseAmount });
        }
    }

}
