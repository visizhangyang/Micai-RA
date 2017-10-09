import { Injectable } from '@angular/core'
import { ApiService } from './ApiService'

@Injectable()
export class RiskService {

    constructor(private apiService: ApiService) { }

    getSchema() {
        return this.apiService.getJSON('/riskalyze_schema').then((res) => {
            return res.data;
        }).catch((res) => {
            console.log(res)
        })
    }
}