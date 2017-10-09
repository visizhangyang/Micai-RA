<ion-header>
    <ion-navbar>
        <ion-title>
            投资策略
        </ion-title>
    </ion-navbar>
</ion-header>
<ion-content>
    <div class="section-info">
        请选择您的投资策略，我们会根据投资偏好与流动智能生成投资策略。
        <span class="risk">我要进行风险评测</span>
    </div>
    <div class="section-risk-result">
        <div class="result-wrapper">
            <div class="risk-number ra-large-font" [style.color]="riskLevelColors[riskLevel - 1]">{{riskLevel}}</div>
            <div class="split-line">
                <div class="split-line-dash"> </div>
            </div>
            <div class="risk-text ra-large-font">{{getRiskLevelText()}}</div>
        </div>
    </div>
    <div class="risk-adjust">
        <ion-range min="1" max="10" step="1" snaps="true" [(ngModel)]="riskLevel" (tap)="onTap($event)" (ionChange)="onRiskChange()">
            <ion-label range-left>1</ion-label>
            <ion-label range-right>10</ion-label>
        </ion-range>
    </div>
    <div class="yearly-rate">
        <div class="return-rate">
            <div class="rate-header ra-large-font">历史年化收益率</div>
            <div class="rate-value">{{returnRate | raPercent}}</div>
        </div>
        <div class="volatility-rate">
            <div class="rate-header ra-large-font">历史年化波动率</div>
            <div class="rate-value">{{volatilityRate | raPercent}}</div>
        </div>
    </div>
</ion-content>

<ion-footer>
    <button ion-button full (click)="doInvestClick()">我要投资</button>
</ion-footer>