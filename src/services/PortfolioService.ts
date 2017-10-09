import { Injectable } from '@angular/core'
import { ApiService } from './ApiService'

@Injectable()
export class PortfolioService {

    constructor(private apiService: ApiService) { }

    getTemplate(riskLevel) {
        return this.apiService.getJSON('/portfolio_template/' + riskLevel).then((res) => {
            return res;
        }).catch((res) => {
            console.log(res)
        })
    }

    getTargetOrderList() {
        return ['FIXED_INCOME', 'STOCK', 'ALTERNATIVE', 'CASH'];
    }

    getPortfolioList(): Promise<any> {

        const assets = {
            totalValue: 0,
            returnTotal: 0,
            returnYesterday: 0,
            portfolios: [],
        }

        return this.apiService.getJSON('/portfolios/').then((res) => {
            const { count, results, } = res
            for (let item of results) {
                const { id, name, created, general_info } = item
                const asset = {
                    id,
                    name,
                    marketValue: general_info.current_value,
                    return: general_info.return,
                    yesterday_return: general_info.yesterday_return,
                    returnRate: general_info.return_rate,
                    created: new Date(created),
                }
                assets.portfolios.push(asset)
                assets.totalValue += asset.marketValue
                assets.returnTotal += asset.return
                assets.returnYesterday += asset.yesterday_return
            }
            return assets
        })
    }

    getPortfolio(id: number): Promise<any> {
        return this.apiService.getJSON(`/portfolios/${id}/`)
    }

    invest(amount: number, templateId: string) {
        let body = {
            investment: amount,
            tpl: templateId
        }
        return this.apiService.postJSON('/portfolios/', body).then((res) => {
            return res;
        }).catch((res) => {
            console.log(res);
            return res;
        })
    }

    getRebalance(portfolioId: number) {
        return this.apiService.getJSON('/portfolios/rebalance/' + portfolioId).then((res) => {
            return res;
        })
    }

    doRebalance(portfolioId: number) {
        return this.apiService.post('/portfolios/rebalance/' + portfolioId + '/', null).then((res) => {
            return res;
        })
    }

    getOrderPlans() {
        return this.apiService.getJSON('/order_plans/').then((res) => {
            return res;
        }).catch((res) => {
            console.log(res);
        })
    }

    getOrderPlansByPortfolio(portfolioId: number) {
        return this.apiService.getJSON('/order_plans/?portfolio_id=' + portfolioId).then((res) => {
            return res;
        }).catch((res) => {
            console.log(res);
        })
    }

    getOrderPlan(orderPlanId: number) {
        return this.apiService.getJSON('/order_plans/' + orderPlanId + '/').then((res) => {
            return res;
        }).catch((res) => {
            console.log(res);
        })
    }

    getRedeemPlan(portfolioId: number, amount: number) {
        let body = { preview: true, amount: amount };
        return this.apiService.postJSON('/portfolios/redeem/' + portfolioId + '/', body).then((res) => {
            return res;
        }).catch((res) => {
            console.log(res);
            return res;
        })
    }

    getRedeemAllPlan(portfolioId: number) {
        return this.apiService.getJSON('/portfolios/redeem_all/' + portfolioId + '/').then((res) => {
            return res;
        }).catch((res) => {
            console.log(res);
            return res;
        })
    }

    redeem(portfolioId: number, amount: number) {
        let body = { preview: false, amount: amount };
        return this.apiService.postJSON('/portfolios/redeem/' + portfolioId + '/', body).then((res) => {
            return res;
        }).catch((res) => {
            console.log(res);
            return res;
        })
    }

    redeemAll(portfolioId: number) {
        return this.apiService.postJSON('/portfolios/redeem_all/' + portfolioId + '/', null).then((res) => {
            return res;
        }).catch((res) => {
            console.log(res);
            return res;
        })
    }

    getAppendPlan(portfolioId: number, amount: number) {
        let body = { preview: true, amount: amount };
        return this.apiService.postJSON('/portfolios/append/' + portfolioId + '/', body).then((res) => {
            return res;
        }).catch((res) => {
            console.log(res);
            return res;
        })
    }

    append(portfolioId: number, amount: number) {
        let body = { preview: false, amount: amount };
        return this.apiService.postJSON('/portfolios/append/' + portfolioId + '/', body).then((res) => {
            return res;
        }).catch((res) => {
            console.log(res);
            return res;
        })
    }

}


function timeout(value, time = 2000) {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(value);
        }, time)
    })

}