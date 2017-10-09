import { Component, ViewChild } from '@angular/core'
import { Navbar, NavController, LoadingController, Tabs } from 'ionic-angular'

import { RiskService, PortfolioService } from 'services'
import { PortfolioDetailPage } from './portfolio-detail'
import { PurchaseRedeemPage } from '../trade';
import { RadarInfoPage } from '../asset/radar-info.page'

@Component({
    selector: 'invest-advisor-page',
    templateUrl: 'invest-advisor.html'
})

export class InvestAdvisorPage {

    @ViewChild(Navbar) navBar: Navbar;
    riskLevel: number = 5;
    riskLevelText: string;
    riskLevelDesc: string;
    yearlyRates: any[] = [];
    investCategory: string = 'investSolultion';
    targetCodes: string[];
    proposal: any;
    riskReturnData: any;
    barChartData: any[];
    detailData: any[];
    radar_graph: any;
    onRiskChange: Function;
    historyReturn: any;


    constructor(public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        private riskService: RiskService,
        private portfolioService: PortfolioService) {
        this.getYearlyRates();
        this.targetCodes = this.portfolioService.getTargetOrderList();

    }

    ionViewDidLoad() {
        this.navBar.backButtonClick = (e: UIEvent) => {
            this.navCtrl.popToRoot();
            var t: Tabs = this.navCtrl.parent;
            if (this.navCtrl !== t.getByIndex(1)) {
                t.select(1);
            }
        }
    }

    setRiskLevelTextAndDesc() {
        if (this.riskLevel <= 4) {
            this.riskLevelText = '稳定型';
            this.riskLevelDesc = '如您一样的投资者更适合能随着时间推移提供相对稳定收益的低风险投资。';
        }
        else if (this.riskLevel >= 5 && this.riskLevel <= 7) {
            this.riskLevelText = '平衡型';
            this.riskLevelDesc = '如您一样的投资者更适合平衡收益和风险的投资。您适合能在长期投资中获得较高收益，又在短期控制损失风险的投资组合。';
        }
        else if (this.riskLevel >= 8) {
            this.riskLevelText = '激进型';
            this.riskLevelDesc = '如您一样的投资者更适合有较高风险但能在长期提供更高回报的投资，但在短期也有损失的可能。您了解风险和收益的权衡并在投资上有长远的眼光。';
        }

    }

    getYearlyRates() {
        this.riskService.getSchema().then((result) => {
            this.yearlyRates = result;
            this.setRiskData();
        });
    }

    setRiskData() {
        this.setRiskLevelTextAndDesc();
        if (this.yearlyRates.length >= this.riskLevel) {
            let currentRate = this.yearlyRates[this.riskLevel - 1];
            this.riskReturnData = {
                riskLevel: this.riskLevel,
                riskLevelText: this.riskLevelText,
                returnRate: currentRate.annual_return,
                volatilityRate: currentRate.annual_volatility
            }
        }
    }

    ionViewWillEnter() {
        this.getPortfolioProposal();
        this.onRiskChange = this.debounceFactory(1000);
    }

    getPortfolioProposal() {
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
                this.radar_graph = result.report.radar_graph;
                this.historyReturn = result.report.daily_return;
                let target = this.proposal.target;
                this.barChartData = []
                this.detailData = [];
                Object.keys(target).forEach(key => {
                    this.barChartData.push({ code: key, percentage: target[key].percentage });
                    this.detailData.push({ code: key, products: target[key].products });
                });
                let orderList = this.portfolioService.getTargetOrderList();
                this.barChartData.sort((first, second) => orderList.indexOf(first.code) - orderList.indexOf(second.code));
                this.detailData.sort((first, second) => orderList.indexOf(first.code) - orderList.indexOf(second.code));
            }
        );
    }

    goPortfolioDetail(targetCode) {
        this.navCtrl.push(PortfolioDetailPage, { riskLevel: this.riskLevel, defaultTarget: targetCode, detailData: this.detailData });
    }

    debounceFactory(debouncedDelay) {
        const handleRiskChange = this.handleRiskChange.bind(this)
        let id = null
        return () => {
            if (id) clearTimeout(id)
            id = setTimeout(handleRiskChange, debouncedDelay)
        }
    }

    handleRiskChange() {
        this.setRiskData();
        this.getPortfolioProposal();
    }

    purchase() {
        this.navCtrl.push(PurchaseRedeemPage, { type: 'purchase', 'riskLevel': this.riskLevel });
    }

    onTap(e) {
        let min = 1, max = 10;
        let preRiskLevel = this.riskLevel;
        // 16 is .risk-adjust padding-left
        this.riskLevel = min + Math.round((e.center.x - e.target.offsetLeft - 16) / e.target.offsetWidth * (max - min));

        if (this.riskLevel != preRiskLevel) {
            this.onRiskChange();
        }
    }

    toRadarInfo() {
        this.navCtrl.push(RadarInfoPage)
    }

}
