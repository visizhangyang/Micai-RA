import { Component } from '@angular/core'
import { NavController, ModalController, App } from 'ionic-angular'
import { LoginPage } from './login.page'
import { SMSLoginPage } from './sms-login.page'
import { RegisterPage } from './register.page'
import { TabsPage } from '../tabs'


@Component({
    selector: 'landing-page',
    templateUrl: 'landing.page.html'
})
export class LandingPage {

    constructor(public navCtrl: NavController, public modalCtrl: ModalController, private app: App) {
        // this.login()
        // this.signup()
    }

    ionViewWillEnter() {
        // this.app.setTitle('注册登录');
    }

    login() {
        const profileModal = this.modalCtrl.create(LoginPage)
        profileModal.present()
        // this.navCtrl.push(LoginPage)
    }

    signup() {
        // const profileModal = this.modalCtrl.create(RegisterPage)
        // profileModal.present()
        this.navCtrl.push(RegisterPage)
    }
}
