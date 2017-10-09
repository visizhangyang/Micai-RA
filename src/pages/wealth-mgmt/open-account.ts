import { Component } from '@angular/core'
import { NavController } from 'ionic-angular'

@Component({
    selector: 'open-account-page',
    templateUrl: 'open-account.html'
})

export class OpenAccountPage {

    constructor(public navCtrl: NavController) {
    }

    goBack() {
        this.navCtrl.pop();
    }

}