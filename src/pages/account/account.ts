import { Component } from '@angular/core'
import { NavController } from 'ionic-angular'
import { UserService } from 'services'

import { AboutPage } from '../about';
import { ProfilePage } from './profile';


@Component({
    selector: 'account-page',
    templateUrl: 'account.html'
})

export class AccountPage {

    phone: string = '';

    constructor(public navCtrl: NavController, private userService: UserService) {
    }

    ionViewWillEnter() {
        this.getUserDetail();
    }

    getUserDetail() {
        this.userService.getDetail().then((result) => {
            this.phone = result && result.phone || '';
        });
    }

    goProfile() {
        this.navCtrl.push(ProfilePage);
    }

    aboutClick() {
        this.navCtrl.push(AboutPage);
    }
}
