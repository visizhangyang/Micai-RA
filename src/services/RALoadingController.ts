import { Injectable } from '@angular/core'
import { LoadingController } from 'ionic-angular'


@Injectable()
export class RALoadingController {

    constructor(public loadingCtrl: LoadingController) {
    }

    loading(fn: Function) {
        const promise = fn()
        if (promise instanceof Promise) {
            const loadingCtrl = this.showLoadingView()
            promise.then(this.dismissLoadingView.bind(this, loadingCtrl), this.dismissLoadingView.bind(this, loadingCtrl))
        }
        return promise
    }

    showLoadingView() {
        const loading = this.loadingCtrl.create()
        loading.present()
        return loading
    }

    dismissLoadingView(loading) {
        loading && loading.dismiss()
    }
}