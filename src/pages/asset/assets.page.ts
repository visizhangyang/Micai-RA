import { Component } from '@angular/core'
import { NavController, Tabs } from 'ionic-angular'
import { PortfolioService, RALoadingController } from 'services'
import { AssetDetailsPage } from './asset-details.page'
import { TradeListPage } from '../trade'

@Component({
    selector: 'assets-page',
    templateUrl: 'assets.page.html'
})

export class AssetsPage {
    assetsSummary: Object = {
        totalValue: null,
        returnTotal: '-',
        returnYesterday: '-',
        returnLast: '-',
    }

    portfolios: Object[]

    hasAssets: Boolean = null

    constructor(
        public navCtrl: NavController,
        private portfolioService: PortfolioService,
        private loadingCtrl: RALoadingController,
    ) {

    }

    ionViewWillEnter() {
        this.loadingCtrl.loading(this.loadPortfolioList.bind(this))
    }


    loadPortfolioList() {
        return this.portfolioService.getPortfolioList().then((assets) => {
            const {
                totalValue,
                returnTotal,
                returnYesterday,
                portfolios,
            } = assets

            this.assetsSummary = {
                totalValue: totalValue,
                returnTotal: returnTotal,
                returnYesterday: returnYesterday,
            }

            this.portfolios = portfolios
            this.hasAssets = this.portfolios != null && this.portfolios.length > 0

            // this.hasAssets = false

        }).catch(res => {
            console.error(res)
        })
    }

    toDtailsPage(id) {
        this.navCtrl.push(AssetDetailsPage, { id })
    }

    invest() {
        var t: Tabs = this.navCtrl.parent;
        t.select(0);
        // t.getByIndex(0).push(InvestStrategyPage);
    }

    viewTradeRecords() {
        this.navCtrl.push(TradeListPage);
    }

}
