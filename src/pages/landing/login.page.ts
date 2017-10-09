import { Component } from '@angular/core'
import { App, ViewController, NavController } from 'ionic-angular'
import { UserService } from 'services'
import { Observable } from 'rxjs/Observable'
import { SMSLoginPage } from './sms-login.page'
import { RegisterPage } from './register.page'
import { TabsPage } from '../tabs'
import { REGEX_PHONE_NUMBER } from './common'

@Component({
    selector: 'login-page',
    templateUrl: 'login.page.html'
})
export class LoginPage {

    public phoneNumber: string
    public password: string
    public error: string
    public canSubmit: boolean = false

    constructor(public appCtrl: App, public viewCtrl: ViewController, public navCtrl: NavController, private userService: UserService) {
    }

    validate(showError = false): Boolean {

        this.error = null
        let error: string = null

        if (this.phoneNumber == null || this.phoneNumber == '' || this.password == null || this.password == '') {
            this.canSubmit = false
            return false
        }

        this.canSubmit = true

        if (!REGEX_PHONE_NUMBER.test(this.phoneNumber)) {
            error = '手机号码格式不正确'
        }

        if (error) {
            if (showError) this.error = error
            return false
        } else {
            return true
        }
    }


    login() {
        if (!this.validate(true)) return
        return this.userService.login(this.phoneNumber, this.password)
            .then(res => {
                this.toHomePage()
            }).catch((error) => {
                this.error = '手机号或密码不正确'
            })
    }

    toHomePage() {

        const currentNav = this.navCtrl
        const rootNav = currentNav.parent || this.navCtrl
        rootNav.setRoot(TabsPage)

        if (currentNav.parent) {
            currentNav.remove(0, currentNav.length() - 1).then(() => {
                currentNav.pop({
                    direction: 'forward',
                    easing: 'linear',
                })
            })
        }
    }

    toSMSLoginPage() {
        this.navCtrl.push(SMSLoginPage)
    }

    toRegisterPage() {
        this.navCtrl.push(RegisterPage)
    }

    dismiss() {
        this.viewCtrl.dismiss()
    }
}
