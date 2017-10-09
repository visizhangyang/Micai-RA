<ion-header>
    <ion-navbar>
        <ion-title>
            弥财智能投顾
        </ion-title>
    </ion-navbar>
</ion-header>

<ion-content>
    <div class="invest-introduction ra-small-font ra-gray">
        我们将根据流动性与风险偏好，专属定制您的投资方案
    </div>
    <div class="yearly-rate">
        <div class="return-rate">
            <div class="rate-header ra-large-font">历史年化收益率</div>
            <div class="rate-value">{{ proposal?.riskalyze.annual_return | raPercent}}</div>
        </div>
        <div class="volatility-rate">
            <div class="rate-header ra-large-font">历史年化波动率</div>
            <div class="rate-value">{{ proposal?.riskalyze.annual_volatility | raPercent}}</div>
        </div>
    </div>

    <div padding>
        <ion-segment [(ngModel)]="investCategory">
            <ion-segment-button value="investSolultion">
                投资方案
            </ion-segment-button>
            <ion-segment-button value="historyRate">
                历史收益
            </ion-segment-button>
        </ion-segment>
    </div>
    <div [ngSwitch]="investCategory">
        <div *ngSwitchCase="'investSolultion'" class="invest-solution">
            <div class="introduction">您的投资方案如下：</div>
            <donut [data]="donutData"></donut>
            <ion-list class="about-list">
                <ion-item class="head" detail-none>
                    产品推荐
                </ion-item>
                <button *ngFor="let targetCode of targetCodes" ion-item (click)="goPortfolioDetail(targetCode)">
                    <span class="sign target-sign {{targetCode}}">&nbsp;</span>
                    <span class="name">{{ targetCode | transAsset }}</span>
                    <span class="percent">推荐配置 {{ proposal?.target[targetCode].percentage | raPercent }}</span>
                </button>
            </ion-list>
        </div>
        <div *ngSwitchCase="'historyRate'">
            <history-graph [riskLevel]="riskLevel"></history-graph>
        </div>
    </div>
</ion-content>

<ion-footer>
    <button ion-button full (click)="openAccount()">我要投资</button>
</ion-footer>