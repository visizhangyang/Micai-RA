import { Injectable } from '@angular/core'
import { ApiService } from './ApiService'

@Injectable()
export class HistoryService {

    constructor(private apiService: ApiService) { }

    appendQueryString(queryString, name, value) {
        if (!value) {
            return queryString;
        }

        if (queryString == '') {
            queryString += '?'
        }
        else {
            queryString += '&';
        }

        return queryString + name + '=' + value;
    }

    getReturn(riskLevel, startDate, endDate) {
        let queryString = '';
        queryString = this.appendQueryString(queryString, 'start_date', startDate);
        queryString = this.appendQueryString(queryString, 'end_date', endDate);

        return this.apiService.getJSON('/historical_return/' + riskLevel + queryString).then((res) => {
            return res;
        }).catch((res) => {
            console.log(res)
        })
    }

    getIndexReturn(indices, startDate, endDate) {
        let queryString = '';
        queryString = this.appendQueryString(queryString, 'indices', indices);
        queryString = this.appendQueryString(queryString, 'start_date', startDate);
        queryString = this.appendQueryString(queryString, 'end_date', endDate);

        return this.apiService.getJSON('/index_historical_return' + queryString).then((res) => {
            return res;
        }).catch((res) => {
            console.log(res)
        })
    }
}