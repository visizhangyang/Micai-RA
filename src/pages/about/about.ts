import { Component } from '@angular/core'
import { NavController } from 'ionic-angular'

import { AboutDetailPage } from './about-detail'

@Component({
    selector: 'about-page',
    templateUrl: 'about.html'
})

export class AboutPage {
    aboutDetailPage = AboutDetailPage;

    constructor(public navCtrl: NavController) {
    }

    openSupportURL() {
        window.open('http://micaiapp.com/', '_blank');
    }

}
