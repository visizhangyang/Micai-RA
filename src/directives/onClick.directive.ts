import { Directive, ElementRef, Input, HostListener } from '@angular/core'
import { LoadingController, Loading } from 'ionic-angular'

@Directive({ selector: '[onClick]' })
export class OnClickDirective {

    @Input('onClick') clickToDo: Function

    private _loading: Loading

    constructor(el: ElementRef, public loadingCtrl: LoadingController) {
        this.dismissLoadingView = this.dismissLoadingView.bind(this)
    }

    @HostListener('click') onClick(e) {
        const promise = this.clickToDo(e)
        if (promise instanceof Promise) {
            this.showLoadingView()
            promise.then(this.dismissLoadingView, this.dismissLoadingView)
        }
    }

    showLoadingView() {
        this._loading = this.loadingCtrl.create()
        this._loading.present()
    }

    dismissLoadingView() {
        this._loading && this._loading.dismiss()
        this._loading = null
    }
}