import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'formatNumber' })
export class FormatNumberPipe implements PipeTransform {
    transform(value: number, decimalDigits: number = 2): string {
        return value.toFixed(decimalDigits)
    }
}

@Pipe({ name: 'formatNumberWithSymbol' })
export class FormatNumberWithSymbolPipe implements PipeTransform {
    transform(value: number, decimalDigits: number = 2): string {
        const symbol = value >= 0 ? '+' : ''
        return symbol + value.toFixed(decimalDigits)
    }
}

@Pipe({ name: 'fractionPart' })
export class FractionPartPipe implements PipeTransform {
    transform(value: number, decimalDigits: number = 2): string {
        const v = value % 1
        return v.toFixed(decimalDigits).substr(decimalDigits)
    }
}

@Pipe({ name: 'integer' })
export class IntegerPipe implements PipeTransform {
    transform(value: number): string {
        return parseInt(value + '').toString()
    }
}