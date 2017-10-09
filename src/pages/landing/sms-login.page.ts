import { Component } from '@angular/core'
import { App, ViewController, NavController } from 'ionic-angular'
import { UserService } from 'services'
import { Observable } from 'rxjs/Observable'
import { LoginPage } from './login.page'
import { RegisterPage } from './register.page'
import { TabsPage } from '../tabs'
import { REGEX_PHONE_NUMBER, REGEX_PHONE_CODE, MAP_ERROR_CODE } from './common'


@Component({
    selector: 'sms-login-page',
    templateUrl: 'sms-login.page.html'
})
export class SMSLoginPage {

    public phoneNumber: string
    public code: string
    public error: string
    public canSubmit: boolean = false
    public fetchingCode: boolean = false
    private _interval_id: any = null
    public timeCount: number = 0



    constructor(public appCtrl: App, public viewCtrl: ViewController, public navCtrl: NavController, private userService: UserService) {
        this.handleError = this.handleError.bind(this)
    }

    validate(showError = false): Boolean {

        this.error = null
        let error: string = null

        if (this.phoneNumber == null || this.phoneNumber == '' || this.code == null || this.code == '') {
            this.canSubmit = false
            return false
        }

        this.canSubmit = true

        if (!REGEX_PHONE_NUMBER.test(this.phoneNumber)) {
            error = '手机号码格式不正确'
        } else if (!REGEX_PHONE_CODE.test(this.code)) {
            error = '验证码格式不正确'
        }

        if (error) {
            if (showError) this.error = error
            return false
        } else {
            return true
        }
    }

    fetchSMSCode() {

        if (this.phoneNumber == null || this.phoneNumber == '') {
            this.error = '请输入手机号码'
            return
        } else if (!REGEX_PHONE_NUMBER.test(this.phoneNumber)) {
            this.error = '手机号码格式不正确'
            return
        }
        this.userService.fetchLoginSMSCode(this.phoneNumber)
            .then(res => {
                this.fetchingCode = true
                this.timeCount = 60
                this._interval_id = setInterval(this.timeCounter.bind(this), 1000)
            })
            .catch(this.handleError)

    }

    timeCounter() {
        this.timeCount--
        if (this.timeCount <= 0) {
            clearInterval(this._interval_id)
            this.fetchingCode = false
        }
    }

    login() {
        if (!this.validate(true)) return
        return this.userService.smsLogin(this.phoneNumber, this.code)
            .then(res => {
                this.toHomePage()
            }).catch(this.handleError)
    }



    handleError(error) {
        let errorMessage = MAP_ERROR_CODE[error.error_code]
        this.error = errorMessage || '系统错误'
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

    toPasswordLoginPage() {
        this.navCtrl.pop()
    }

    toRegisterPage() {
        this.navCtrl.push(RegisterPage)
    }

    dismiss() {
        this.viewCtrl.dismiss()
    }
}
