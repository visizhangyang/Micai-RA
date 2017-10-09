import { Component } from '@angular/core'
import { NavController, NavParams, Tabs, AlertController, ToastController } from 'ionic-angular'
import { PortfolioService, RALoadingController } from 'services'
import { RebalanceInfoPage } from './rebalance-info.page'
const PRODUCT_TYPE = ['FIXED_INCOME', 'STOCK', 'ALTERNATIVE', 'CASH']

@Component({
    selector: 'asset-rebalance-page',
    templateUrl: 'rebalance.page.html'
})
export class AssetRebalancePage {

    portfolio_id: number

    portfolio_target: any

    isInPosition: boolean
    // 资产显示市值
    show_market_value: boolean = true

    radar_graph: any

    rebalance_graph: any

    needAdjust: boolean = false

    barChartData: any[]

    constructor(
        private navController: NavController,
        private navParams: NavParams,
        public alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private portfolioService: PortfolioService,
        private loadingCtrl: RALoadingController,
    ) {

    }

    ionViewWillEnter() {
        this.portfolio_id = this.navParams.get('id')
        this.loadingCtrl.loading(this.loadRebalance.bind(this))
    }

    ionViewDidLoad() {

    }

    loadRebalance() {

        return this.portfolioService.getRebalance(this.portfolio_id).then((res) => {
            if (res && res.rebalance_plan) {

                const { radar_graphs, rebalance_plan } = res

                this.radar_graph = radar_graphs.portfolio
                this.rebalance_graph = radar_graphs.rebalance

                this.portfolio_target = []

                PRODUCT_TYPE.forEach(type => {
                    rebalance_plan[type].type = type
                    rebalance_plan[type].klass = 'arrow-up' // 默认展开
                    this.portfolio_target.push(rebalance_plan[type])

                })

                this.barChartData = []
                Object.keys(rebalance_plan).forEach(key => {
                    this.barChartData.push({ code: key, percentage: rebalance_plan[key].suggest })
                })
                let orderList = this.portfolioService.getTargetOrderList()
                this.barChartData.sort((first, second) => orderList.indexOf(first.code) - orderList.indexOf(second.code))


                this.needAdjust = true
            }
        }).catch(() => {
            let toast = this.toastCtrl.create({
                message: '不需要优化',
                duration: 1500,
                position: 'top',
                cssClass: 'text-center',
            })
            toast.present()
            this.navController.pop()
        })
    }

    toggleAssetVisibility(asset) {
        asset.klass = asset.klass == 'arrow-up' ? 'arrow-down' : 'arrow-up'
    }

    doRebalance() {
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
                            })
                            warning.present()
                            return false
                        }
                        else {
                            this.loadingCtrl.loading(this.rebalance.bind(this))
                            return true
                        }

                    }
                }
            ]
        })
        prompt.present()
    }

    rebalance() {
        return this.portfolioService.doRebalance(this.portfolio_id).then(
            (result) => {
                this.navController.pop()
            }
        )
    }

    toRebalanceInfo() {
        this.navController.push(RebalanceInfoPage)
    }
}
