import { Component } from '@angular/core'
import { NavController, NavParams, LoadingController } from 'ionic-angular'

import { PortfolioService } from 'services'

import { DonutComponent } from '../../components'
import { OpenAccountPage } from './open-account'
import { PurchasePage } from '../trade';
import { PortfolioDetailPage } from './portfolio-detail'


@Component({
    selector: 'invest-portfolio-page',
    templateUrl: 'invest-portfolio.html'
})

export class InvestPortfolioPage {

    investCategory: string = 'investSolultion';
    riskLevel: number;
    proposal: any;
    donutData: any[];
    detailData: any[];
    targetCodes: string[];

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public loadingCtrl: LoadingController, private portfolioService: PortfolioService) {
        this.riskLevel = this.navParams.get('riskLevel');
        this.targetCodes = this.portfolioService.getTargetOrderList();
    }

    ionViewWillEnter() {
        this.getPortfolioProposal();
    }

    getPortfolioProposal() {
        if (this.riskLevel) {
            let loader = this.loadingCtrl.create(
                {
                    spinner: 'hide',
                    content: `
                        <div class="custom-spinner-container">
                            <div class="custom-spinner-box"></div>
                            <div>正在为您运算</div>
                        </div>`
                }
            );
            loader.present();
            this.portfolioService.getTemplate(this.riskLevel).then(
                (result) => {
                    loader.dismiss();
                    this.proposal = result.report;
                    let target = result.report.target;
                    this.donutData = [];
                    this.detailData = [];
                    Object.keys(target).forEach(key => {
                        this.donutData.push({ code: key, percentage: target[key].percentage });
                        this.detailData.push({ code: key, products: target[key].products });
                    });
                    let orderList = this.portfolioService.getTargetOrderList();
                    this.donutData.sort((first, second) => orderList.indexOf(first.code) - orderList.indexOf(second.code));
                    this.detailData.sort((first, second) => orderList.indexOf(first.code) - orderList.indexOf(second.code));
                }
            );
        }
    }

    openAccount() {
        // this.navCtrl.push(OpenAccountPage);
        this.navCtrl.push(PurchasePage, { riskLevel: this.riskLevel });
    }

    goPortfolioDetail(targetCode) {
        this.navCtrl.push(PortfolioDetailPage, { defaultTarget: targetCode, detailData: this.detailData });
    }

}