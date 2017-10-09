import { Component } from '@angular/core'
import { NavController, NavParams, Tabs } from 'ionic-angular'

import { PortfolioService } from 'services'

@Component({
    selector: 'trade-detail-page',
    templateUrl: 'trade-detail.html'
})

export class TradeDetailPage {

    portfolioId: number;
    adjustType: string;
    adjustLabel: string;
    adjustDateTime: Date;
    detailData: any[];
    orderPlanId: number;
    amount: number;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private portfolioService: PortfolioService) {
        this.portfolioId = this.navParams.get('portfolioId');
        this.adjustType = this.navParams.get('adjustType');
        this.detailData = this.navParams.get('detailData');
        this.orderPlanId = this.navParams.get('orderPlanId');

        this.setAdjustLabel();

        if (this.orderPlanId != null && this.detailData == null) {
            this.getDetailData();
        }
    }

    setAdjustLabel() {
        if (this.adjustType === 'NEW' || this.adjustType === 'APPEND') {
            this.adjustLabel = '购买金额';
        }
        else if (this.adjustType === 'REBALANCE') {
            this.adjustLabel = '优化';
        }
        else if (this.adjustType === 'REDEEM' || this.adjustType === 'REDEEM_ALL') {
            this.adjustLabel = '赎回金额';
        }
    }

    getDetailData() {
        this.portfolioService.getOrderPlan(this.orderPlanId).then(
            (result) => {
                this.adjustType = result.order_type;
                this.setAdjustLabel();
                this.adjustDateTime = new Date(result.created);
                this.amount = result.amount;
                let target = result.target;
                this.detailData = []
                Object.keys(target).forEach(key => {
                    let products = target[key].products;
                    for (let product of products) {
                        product.statusLabel = this.getStatusLabel(product.amount, product.status);
                    }
                    this.detailData.push({ code: key, products: products });
                });

                let orderList = this.portfolioService.getTargetOrderList();
                this.detailData.sort((first, second) => orderList.indexOf(first.code) - orderList.indexOf(second.code));
            }
        );
    }

    getStatusLabel(amount, orderStatus) {
        let result = '';

        if (amount > 0) {
            if (orderStatus === 'SUCCESS') {
                result = '已买入';
            }
            else {
                result = '待买入';
            }
        }
        else if (amount < 0) {
            if (orderStatus === 'SUCCESS') {
                result = '已赎回';
            }
            else {
                result = '待赎回';
            }
        }

        return result;
    }

}
