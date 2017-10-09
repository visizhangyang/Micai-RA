import { Component } from '@angular/core'
import { NavController } from 'ionic-angular'

import { RiskService } from 'services'

import { InvestPortfolioPage } from './invest-portfolio'

@Component({
    selector: 'invest-strategy-page',
    templateUrl: 'invest-strategy.html'
})
export class InvestStrategyPage {

    riskLevel: number = 5;
    riskLevelColors: any[] = ['#0291ff', '#1ba2ff', '#3fbbff', '#62d2fc', '#8ac7bc', '#afbc82', '#d7b141', '#ffa400', '#fc731f', '#fa5333'];
    returnRate: number;
    volatilityRate: number;
    yearlyRates: any[] = [];

    constructor(public navCtrl: NavController, private riskService: RiskService) {
        this.getYearlyRates();
    }

    getRiskLevelText() {
        if (this.riskLevel <= 4) {
            return '稳定型';
        }
        else if (this.riskLevel >= 5 && this.riskLevel <= 7) {
            return '平衡型';
        }
        else if (this.riskLevel >= 8) {
            return '激进型';
        }

    }

    getYearlyRates() {
        this.riskService.getSchema().then((result) => {
            this.yearlyRates = result;
            this.setCurrentRate();
        });
    }

    setCurrentRate() {
        if (this.yearlyRates.length >= this.riskLevel) {
            let currentRate = this.yearlyRates[this.riskLevel - 1];
            this.returnRate = currentRate.annual_return;
            this.volatilityRate = currentRate.annual_volatility;
        }
    }

    onRiskChange() {
        this.setCurrentRate();
    }

    doInvestClick() {
        this.navCtrl.push(InvestPortfolioPage, { riskLevel: this.riskLevel });
    }

    onTap = function (e) {
        let min = 1, max = 10;
        this.riskLevel = min + Math.round((e.center.x - e.target.offsetLeft) / e.target.offsetWidth * (max - min));
    };
}
