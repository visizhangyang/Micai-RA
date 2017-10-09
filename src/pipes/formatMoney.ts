import { Pipe, PipeTransform } from '@angular/core'
import numeral from 'numeral'

@Pipe({ name: 'formatMoney' })
export class FormatMoneyPipe implements PipeTransform {
    transform(value: string, decimalDigits: number = 2): string {
        const money = Number(value)
        if (isNaN(money)) return value
        let pattern = '0,0.00'
        if (decimalDigits == 0) pattern = '0,0'
        else if (decimalDigits == 1) pattern = '0,0.0'

        return numeral(money).format(pattern)
    }
}

@Pipe({ name: 'formatMoneyWithSymbol' })
export class FormatMoneyWithSymbolPipe extends FormatMoneyPipe {
    transform(value: string, decimalDigits: number = 2): string {
        const money = Number(value)
        let symbol = ''
        if (!isNaN(money)) {
            symbol = money > 0 ? '+' : ''
        }

        return symbol + super.transform(value, decimalDigits)
    }
}