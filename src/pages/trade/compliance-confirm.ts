import { Component } from '@angular/core'
import { NavController, AlertController, NavParams, Tabs } from 'ionic-angular'

import { PortfolioService } from 'services'
import { TradeListPage } from './trade-list'
import { AssetDetailsPage } from '../asset'

@Component({
    selector: 'compliance-confirm-page',
    templateUrl: 'compliance-confirm.html'
})

export class ComplianceConfirmPage {

    complianceType: string;
    riskLevel: number;
    amount: number;
    amountLabel: string;
    confirmButtonLabel: string;
    portfolioId: number;
    template: any;
    detailData: any[];

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public alertCtrl: AlertController,
        private portfolioService: PortfolioService) {

    }

    ionViewWillEnter() {
        this.complianceType = this.navParams.get('complianceType');
        this.riskLevel = this.navParams.get('riskLevel');
        this.amount = this.navParams.get('amount');
        this.portfolioId = this.navParams.get('portfolioId');

        if (this.complianceType === 'purchase') {
            this.amountLabel = '投入金额';
            this.confirmButtonLabel = "确认购买";
            this.getPortfolioProposal();
        }
        else if (this.complianceType === 'append') {
            this.amountLabel = '购买金额';
            this.confirmButtonLabel = "确认购买";
            this.getAppendPlan();
        }
        else if (this.complianceType === 'redeem') {
            this.amountLabel = '赎回金额';
            this.confirmButtonLabel = "确认赎回";
            this.getRedeemPlan();
        }
        else if (this.complianceType === 'redeem_all') {
            this.amountLabel = '赎回金额';
            this.confirmButtonLabel = "确认赎回";
            this.getRedeemAllPlan();
        }
    }



    getPortfolioProposal() {
        if (this.riskLevel && this.amount) {
            this.portfolioService.getTemplate(this.riskLevel).then(
                (result) => {
                    this.template = result;
                    let target = result.report.target;
                    this.processDetailData(target, '待买入');
                }
            );
        }
    }

    getAppendPlan() {
        if (this.portfolioId != null && this.amount) {
            this.portfolioService.getAppendPlan(this.portfolioId, this.amount).then(
                (result) => {
                    this.processDetailData(result.append_plan, '待买入');
                }
            );
        }
    }

    getRedeemPlan() {
        if (this.portfolioId != null && this.amount) {
            this.portfolioService.getRedeemPlan(this.portfolioId, this.amount).then(
                (result) => {
                    this.processDetailData(result.redemption_plan, '待赎回');
                }
            );
        }
    }

    getRedeemAllPlan() {
        this.portfolioService.getRedeemAllPlan(this.portfolioId).then(
            (result) => {
                this.amount = result.current_value;
                this.processDetailData(result.redemption_plan, '待赎回');
            }
        );
    }

    processDetailData(plan, statusLabel = '') {
        this.detailData = []
        Object.keys(plan).forEach(key => {
            let products = plan[key].products;
            for (let product of products) {
                product.amount = this.amount * product.percentage;
                product.statusLabel = statusLabel;
            }
            this.detailData.push({ code: key, products: products });
        });

        this.sortDetailData();
    }

    sortDetailData() {
        let orderList = this.portfolioService.getTargetOrderList();
        this.detailData.sort((first, second) => orderList.indexOf(first.code) - orderList.indexOf(second.code));
    }

    confirm() {
        let prompt = this.alertCtrl.create({
            title: '请输入交易密码',
            inputs: [
                {
                    name: 'password',
                    type: 'password',
                    placeholder: '交易密码'
                },
            ],
            buttons: [
                {
                    text: '取消'
                },
                {
                    text: '好',
                    handler: data => {
                        if (data.password !== '111111') {
                            let warning = this.alertCtrl.create({
                                title: '密码错误!',
                                buttons: ['好']
                            });
                            warning.present();
                            return false;
                        }
                        else {
                            this.doConfirm();
                            return true;
                        }

                    }
                }
            ]
        });
        prompt.present();
    }

    doConfirm() {
        if (this.complianceType === 'purchase') {
            this.portfolioService.invest(this.amount, this.template.id).then(
                (result) => {
                    this.doAfterConfirm(result.id);
                }
            );
        }
        else if (this.complianceType === 'append') {
            this.portfolioService.append(this.portfolioId, this.amount).then(
                (result) => {
                    this.doAfterConfirm(this.portfolioId);
                }
            );
        }
        else if (this.complianceType === 'redeem') {
            this.portfolioService.redeem(this.portfolioId, this.amount).then(
                (result) => {
                    this.doAfterConfirm(this.portfolioId);
                }
            );
        }
        else if (this.complianceType === 'redeem_all') {
            this.portfolioService.redeemAll(this.portfolioId).then(
                (result) => {
                    this.doAfterConfirm(this.portfolioId);
                }
            );
        }
    }

    doAfterConfirm(portfolioId) {
        this.navCtrl.popToRoot({ animate: false });

        var t: Tabs = this.navCtrl.parent;
        if (t && this.navCtrl !== t.getByIndex(1)) {
            t.select(1);
        }
        if (t) {
            t.getByIndex(1).push(AssetDetailsPage, { id: portfolioId });
        }
    }

}
