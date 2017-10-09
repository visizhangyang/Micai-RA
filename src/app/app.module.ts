import { NgModule, ErrorHandler } from '@angular/core'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular'
import { AppComponent } from './app.component'
import { LandingPage, LoginPage, SMSLoginPage, RegisterPage } from '../pages/landing'
import {
	DonutComponent, PortfolioHisotryGraphComponent,
	TradeListRecordsComponent, TradeDetailRecordsComponent, AssetBarChartComponent,
	RadarGraphComponent, RiskReturnGraphComponent,
} from '../components'
import { TabsPage } from '../pages/tabs'
import { WealthMgmtPage, OpenAccountPage, PortfolioDetailPage, InvestAdvisorPage } from '../pages/wealth-mgmt'
import { AccountPage, ProfilePage } from '../pages/account'
import { AboutPage, AboutDetailPage } from '../pages/about'
import { AssetsPage, AssetDetailsPage, RadarInfoPage, AssetRebalancePage, RebalanceInfoPage } from '../pages/asset'
import { PurchasePage, RedeemPage, PurchaseRedeemPage, ComplianceConfirmPage, TradeListPage, TradeDetailPage } from '../pages/trade'
import { AssetAllocationPage } from '../pages/rebalance'
import { ApiService, UserService, RiskService, PortfolioService, HistoryService, RALoadingController, } from 'services'
import { OnClickDirective, FluctuationDirective } from '../directives'
import { TransAssetPipe, RaPercentPipe, FormatNumberPipe, FormatNumberWithSymbolPipe, FormatMoneyPipe, FormatMoneyWithSymbolPipe, FormatDatePipe, FormatPercentPipe, FormatPercentWithSymbolPipe, TransTradeTypePipe, FractionPartPipe, IntegerPipe } from '../pipes'


// console.log(LoginPage)

const pages = <any>[
	AppComponent,
	DonutComponent,
	PortfolioHisotryGraphComponent,
	TradeListRecordsComponent,
	TradeDetailRecordsComponent,
	RadarGraphComponent,
	AssetBarChartComponent,
	RiskReturnGraphComponent,
	LoginPage,
	SMSLoginPage,
	RegisterPage,
	LandingPage,
	TabsPage,
	WealthMgmtPage,
	OpenAccountPage,
	PortfolioDetailPage,
	InvestAdvisorPage,
	AccountPage,
	ProfilePage,
	AboutPage,
	AboutDetailPage,
	AssetsPage,
	PurchasePage,
	RedeemPage,
	PurchaseRedeemPage,
	ComplianceConfirmPage,
	AssetDetailsPage,
	TradeListPage,
	TradeDetailPage,
	AssetAllocationPage,
	RadarInfoPage,
	AssetRebalancePage,
	RebalanceInfoPage,
]

// const serviceList = Object.keys(services).map(p => services[p])


@NgModule({
	declarations: [
		OnClickDirective,
		FluctuationDirective,
		TransAssetPipe,
		RaPercentPipe,
		FormatNumberPipe,
		FormatNumberWithSymbolPipe,
		FormatMoneyPipe,
		FormatMoneyWithSymbolPipe,
		FormatDatePipe,
		FormatPercentPipe,
		FormatPercentWithSymbolPipe,
		TransTradeTypePipe,
		FractionPartPipe,
		IntegerPipe,
		...pages
	], imports: [
		IonicModule.forRoot(AppComponent,
			{
				backButtonText: ''
			},
			{
				links: [
					{ component: LandingPage, name: 'Landing', segment: 'landing' },
					{ component: TabsPage, name: 'Tabs', segment: 'tabs' },
					// { component: InvestStrategyPage, name: 'InvestStrategy', segment: 'invest-strategy' },
					// { component: InvestPortfolioPage, name: 'InvestPortfolio', segment: 'invest-portfolio' },
					{ component: OpenAccountPage, name: 'OpenAccount', segment: 'open-account' },
					{ component: PortfolioDetailPage, name: 'PortfolioDetail', segment: 'portfolio-detail' },
					{ component: InvestAdvisorPage, name: 'InvestAdvisor', segment: 'invest-advisor' },
					{ component: ProfilePage, name: 'Profile', segment: 'profile' },
					{ component: AboutPage, name: 'About', segment: 'about' },
					{ component: AboutDetailPage, name: 'AboutDetail', segment: 'about-detail' },
					{ component: AssetsPage, name: 'Asset', segment: 'asset' },
					{ component: AssetDetailsPage, name: 'AssetDetails', segment: 'asset-details/:id' },
					{ component: PurchasePage, name: 'Purchase', segment: 'purchase' },
					{ component: RedeemPage, name: 'Redeem', segment: 'redeem' },
					{ component: PurchaseRedeemPage, name: 'PurchaseRedeem', segment: 'purchase-redeem' },
					{ component: ComplianceConfirmPage, name: 'ComplianceConfirm', segment: 'compliance-confirm' },
					{ component: TradeListPage, name: 'TradeList', segment: 'trade-list' },
					{ component: TradeDetailPage, name: 'TradeDetail', segment: 'trade-detail' },
					{ component: AssetAllocationPage, name: 'AssetAllocation', segment: 'asset-allocation' },
					{ component: RadarInfoPage, name: 'RadarInfoPage', segment: 'radar-info' },
					{ component: AssetRebalancePage, name: 'AssetRebalancePage', segment: 'asset-rebalance/:id' },

				]
			})
	], bootstrap: [IonicApp],
	entryComponents: pages,
	providers: [
		{ provide: ErrorHandler, useClass: IonicErrorHandler },
		RALoadingController,
		ApiService,
		UserService,
		RiskService,
		PortfolioService,
		HistoryService,
	]
})
export class AppModule { }
