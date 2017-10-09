import { Injectable } from '@angular/core'
import { ApiService } from './ApiService'

@Injectable()
export class UserService {

    constructor(private apiService: ApiService) { }

    static isLogin(): Promise<boolean> {
        return Promise.resolve(ApiService.getUserToken() != null)
    }

    fetchRegisterSMSCode(phoneNumber: string) {
        const url = '/user/register/'
        return this.apiService.postJSON(url, {
            phone: phoneNumber
        })
    }

    fetchLoginSMSCode(phoneNumber: string) {
        const url = '/user/login/'
        return this.apiService.postJSON(url, {
            phone: phoneNumber
        })
    }

    smsLogin(phone: string, code: string) {
        return this.apiService.postJSON('/user/login/', { phone, code }).then((res) => {
            const {token, user_id } = res
            ApiService.setUserToken(token)
            return { token, user_id }
        })
    }


    login(phone: string, password: string) {
        return this.apiService.postJSON('/user/password_login/', { phone, password }).then((res) => {
            const {token, user_id } = res
            ApiService.setUserToken(token)
            return { token, user_id }
        })
    }

    register(phone: string, password: string, code: string) {
        return this.apiService.postJSON('/user/register/', { phone, password, code }).then((res) => {
            const {token, user_id } = res
            ApiService.setUserToken(token)
            return { token, user_id }
        })
    }

    logout() {
        ApiService.clearUserToken();
    }

    getDetail() {
        return this.apiService.getJSON('/user/user_details/').then((res) => {
            return res;
        }).catch((res) => {
            console.log(res)
        })
    }
}