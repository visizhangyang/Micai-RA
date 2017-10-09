import { Component } from '@angular/core'
import { Platform, ToastController } from 'ionic-angular'
import { LandingPage } from '../pages/landing'
import { TabsPage } from '../pages/tabs'
import { UnauthorizationSubject, OfflineSubject, UserService } from 'services'

@Component({
	templateUrl: 'app.html'
})
export class AppComponent {

	rootPage: any = TabsPage

	constructor(platform: Platform, public toastCtrl: ToastController) {

		UnauthorizationSubject.subscribe({
			next: (res) => {
				this.rootPage = LandingPage
			}
		})

		OfflineSubject.subscribe({
			next: (res) => {
				let toast = this.toastCtrl.create({
					position: 'top',
					message: '连接失败，请检查你的网络设置',
					cssClass: 'offline',
					duration: 2000,
				})
				toast.present()
			}
		})

		platform.ready().then(() => {
			UserService.isLogin().then((f) => {
				if (!f) {
					this.rootPage = LandingPage
				}
			})
		})
	}
}
