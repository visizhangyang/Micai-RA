import { Component } from '@angular/core'
import { App, NavController, AlertController } from 'ionic-angular'

import { UserService } from 'services'
import { LandingPage } from '../landing'

@Component({
    selector: 'profile-page',
    templateUrl: 'profile.html'
})

export class ProfilePage {

    phone: string = '';

    constructor(public appCtrl: App, public navCtrl: NavController, public alertCtrl: AlertController, private userService: UserService) {
    }

    ionViewWillEnter() {
        this.getUserDetail();
    }

    getUserDetail() {
        this.userService.getDetail().then((result) => {
            this.phone = result && result.phone || '';
        });
    }

    confirmLogout() {
        let confirm = this.alertCtrl.create({
            title: '确认',
            message: '您确定要退出吗？',
            buttons: [
                {
                    text: '取消',
                    handler: () => {
                    }
                },
                {
                    text: '确定',
                    handler: () => {
                        this.userService.logout();
                        this.appCtrl.getRootNav().setRoot(LandingPage);
                    }
                }
            ]
        });
        confirm.present();
    }

}
