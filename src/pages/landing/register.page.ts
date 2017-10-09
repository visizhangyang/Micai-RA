import { Component } from '@angular/core'
import { App, ViewController, NavController, ToastController } from 'ionic-angular'
import { UserService } from 'services'
import { Observable } from 'rxjs/Observable'
import { LoginPage } from './login.page'
import { TabsPage } from '../tabs'
import { REGEX_PHONE_NUMBER, REGEX_PASSWORD_NUMBER, REGEX_PHONE_CODE, MAP_ERROR_CODE } from './common'


@Component({
    selector: 'register-page',
    templateUrl: 'register.page.html'
})
export class RegisterPage {

    public phoneNumber: string
    public password: string
    public code: string
    public error: string
    public canSubmit: boolean = false
    public fetchingCode: boolean = false
    private _interval_id: any = null
    public timeCount: number = 0

    constructor(public appCtrl: App, public viewCtrl: ViewController, public navCtrl: NavController, private userService: UserService, public toastCtrl: ToastController) {
        this.handleSuccess = this.handleSuccess.bind(this)
        this.handleError = this.handleError.bind(this)
    }

    validate(showError = false): Boolean {

        this.error = null
        let error: string = null

        if (this.phoneNumber == null || this.phoneNumber == '' || this.code == null || this.code == '' || this.password == null || this.password == '') {
            this.canSubmit = false
            return false
        }

        this.canSubmit = true

        if (!REGEX_PHONE_NUMBER.test(this.phoneNumber)) {
            error = '手机号格式不正确'
        } else if (!REGEX_PASSWORD_NUMBER.test(this.password)) {
            error = '密码至少8位，包含数字和字母'
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
            this.error = '请输入手机号'
            return
        } else if (!REGEX_PHONE_NUMBER.test(this.phoneNumber)) {
            this.error = '手机号格式不正确'
            return
        }

        this.userService.fetchRegisterSMSCode(this.phoneNumber)
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

    register() {
        if (!this.validate(true)) return
        return this.userService.register(this.phoneNumber, this.password, this.code)
            .then(this.handleSuccess).catch(this.handleError)
    }

    handleError(error) {
        let errorMessage = MAP_ERROR_CODE[error.error_code]
        if (error.error_fields.code) {
            errorMessage = '验证码不正确或已经过期'
        }
        this.error = errorMessage || '系统错误'
    }

    handleSuccess() {
        const toast = this.toastCtrl.create({
            message: '恭喜你注册成功，已经为你登录',
            duration: 2000,
            position: 'top'
        })

        toast.present()

        setTimeout(this.toHomePage.bind(this), 1000)
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
        const previous = this.navCtrl.getPrevious()
        if (previous.instance instanceof LoginPage) {
            this.navCtrl.pop()
        } else {
            this.navCtrl.push(LoginPage)
        }

    }

    dismiss() {
        this.viewCtrl.dismiss()
    }
}
