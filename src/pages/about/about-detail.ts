import { Component } from '@angular/core'
import { NavController } from 'ionic-angular'

@Component({
    selector: 'about-detail-page',
    templateUrl: 'about-detail.html'
})

export class AboutDetailPage {

    constructor(public navCtrl: NavController) {
    }

    openMicaiWeiboURL() {
        window.open('http://weibo.com/u/3978566675', '_blank');
    }
}
