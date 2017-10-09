import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "raPercent"
})

export class RaPercentPipe implements PipeTransform {

    transform(value: number, withSymbol: boolean = false) {
        if (value === undefined || value === null) {
            return '';
        }

        let symbol = ''
        if (withSymbol) {
            if (value > 0) {
                symbol = '+ ';
            }
        }

        if (value < 0) {
            symbol = '- ';
        }

        return symbol + (Math.abs(value) * 100).toFixed(2) + '%';
    }
}