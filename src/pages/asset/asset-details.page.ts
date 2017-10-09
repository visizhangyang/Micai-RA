import { Component } from '@angular/core'
import { NavController, NavParams } from 'ionic-angular'
import { PortfolioService, RALoadingController } from 'services'
// import { AssetAllocationPage } from '../rebalance'
import { PurchaseRedeemPage } from '../trade'
import { RadarInfoPage } from './radar-info.page'
import { AssetRebalancePage } from './rebalance.page'

const PRODUCT_TYPE = ['FIXED_INCOME', 'STOCK', 'ALTERNATIVE', 'CASH']

@Component({
    selector: 'asset-details-page',
    templateUrl: 'asset-details.page.html'
})
export class AssetDetailsPage {

    portfolio_id: number

    portfolio: any

    portfolio_current_value: any

    portfolio_name = '持仓详情'

    portfolio_return: any = '_'

    portfolio_return_yesterday: any = '_'

    daily_return: any

    pending_order_plan_info: any

    portfolio_target: any

    isInPosition: boolean = false

    need_rebalance: false
    // 资产显示市值
    show_market_value: boolean = true

    radar_graph: any

    constructor(
        private navController: NavController,
        private navParams: NavParams,
        private portfolioService: PortfolioService,
        private loadingCtrl: RALoadingController,
    ) {

    }

    ionViewDidLoad() {
        this.portfolio_id = this.navParams.get('id')
        this.loadingCtrl.loading(this.loadPortfolio.bind(this))
    }

    loadPortfolio() {
        return this.portfolioService.getPortfolio(this.portfolio_id).then(res => {
            this.portfolio = res
            const { id, name, general_info, need_rebalance, status, report } = this.portfolio
            const { daily_return, position, pending_order_plan_info, radar_graph } = report
            this.need_rebalance = need_rebalance
            this.portfolio_name = name
            this.portfolio_return = general_info.return
            this.portfolio_return_yesterday = general_info.yesterday_return
            this.pending_order_plan_info = pending_order_plan_info
            this.radar_graph = radar_graph

            this.portfolio_current_value = general_info.current_value

            this.daily_return = daily_return

            // this.daily_return = {
            //     date: ["2017-03-27", "2017-03-28", "2017-03-29", "2017-03-30", "2017-03-31", "2017-04-03", "2017-04-04", "2017-04-05", "2017-04-06", "2017-04-07"],
            //     historical_data: [20000, 20000, 20000, 20000, 20000, 30000, 30000, 30000, 10000, 20000],
            //     comparison_data: [10000, 10000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000],
            // }

            // this.donutData = []

            // Object.keys(target).forEach(key => {
            //     this.donutData.push({ code: key, percentage: target[key].percentage })
            // });

            this.portfolio_target = []

            this.isInPosition = status === 'POSITION';

            PRODUCT_TYPE.forEach(type => {
                position[type].type = type
                position[type].klass = 'arrow-up' // 默认展开
                this.portfolio_target.push(position[type])

            })
        }).catch(err => { })
    }

    changeShowMarketValue(v) {
        this.show_market_value = v
    }

    toggleAssetVisibility(asset) {
        asset.klass = asset.klass == 'arrow-up' ? 'arrow-down' : 'arrow-up'
    }

    get pendingInfo() {
        if (this.pending_order_plan_info) {
            const { type, amount } = this.pending_order_plan_info
            if (type == 'NEW') {
                return '+' + amount.toFixed(2) + '元确认中'
            } else if (type == 'APPEND') {
                return '+' + amount.toFixed(2) + '元追加中'
            } else if (type == 'REDEEM' || type == 'REDEEM_ALL') {
                return amount.toFixed(2) + '元赎回中'
            } else if (type == 'REBALANCE') {
                return amount.toFixed(2) + '元优化中'
            }
        }
    }

    rebalance() {
        // this.navController.push(AssetAllocationPage, { portfolioId: this.portfolio_id })
        this.navController.push(AssetRebalancePage, { id: this.portfolio_id })
    }

    redeem() {
        this.navController.push(PurchaseRedeemPage, { type: 'redeem', portfolioId: this.portfolio_id })
    }

    append() {
        this.navController.push(PurchaseRedeemPage, { type: 'append', portfolioId: this.portfolio_id })
    }

    toRadarInfo() {
        this.navController.push(RadarInfoPage)
    }
}
