import { Component } from '@angular/core'
import { NavController } from 'ionic-angular'

import { InvestAdvisorPage } from './invest-advisor'

@Component({
    selector: 'wealth-mgmt-page',
    templateUrl: 'wealth-mgmt.html'
})
export class WealthMgmtPage {

    constructor(public navCtrl: NavController) {

    }

    ionViewWillEnter() {
        if (this.navCtrl.length() == 1) {
            this.navCtrl.push(InvestAdvisorPage);
        }
    }

    invest() {
        this.navCtrl.push(InvestAdvisorPage);
    }
}
