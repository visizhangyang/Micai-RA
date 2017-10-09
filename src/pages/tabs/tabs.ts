import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { SignupPage } from '../signup';
import { WealthMgmtPage } from '../wealth-mgmt';
import { AccountPage } from '../account';
import { AssetsPage } from '../asset';


@Component({
    selector: 'tabs-page',
    templateUrl: 'tabs.html'
})

export class TabsPage {
    tab1Root: any = WealthMgmtPage;
    tab2Root: any = AssetsPage;
    tab3Root: any = AccountPage;

    mySelectedIndex: number;

    constructor(navParams: NavParams) {
        this.mySelectedIndex = navParams.data.tabIndex || 1;
    }

}

