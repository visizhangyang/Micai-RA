import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "transTradeType"
})

export class TransTradeTypePipe implements PipeTransform {

    transform(code: string) {
        const translation = {
            NEW: '购买',
            APPEND: '追加',
            REBALANCE: '优化',
            REDEEM: '赎回',
            REDEEM_ALL: '赎回'
        };

        return translation[code] || code;
    }
}