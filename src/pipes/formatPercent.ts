import { Pipe, PipeTransform } from '@angular/core'
import numeral from 'numeral'

@Pipe({ name: 'formatPercent' })
export class FormatPercentPipe implements PipeTransform {
    transform(value: string, decimalDigits: number = 2): string {
        const money = Number(value)
        if (isNaN(money)) return value
        return (money * 100).toFixed(decimalDigits) + '%'
    }
}

@Pipe({ name: 'formatPercentWithSymbol' })
export class FormatPercentWithSymbolPipe extends FormatPercentPipe {
    transform(value: string, decimalDigits: number = 2): string {
        const money = Number(value)
        let symbol = ''
        if (!isNaN(money)) {
            symbol = money > 0 ? '+' : ''
        }

        return symbol + super.transform(value, decimalDigits)
    }
}