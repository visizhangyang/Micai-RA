import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'formatDate' })
export class FormatDatePipe implements PipeTransform {
    transform(value: Date, withTime: boolean = false): string {
        if (value == null) {
            return '';
        }

        let result = value.getFullYear() + '/' + (value.getMonth() + 1) +
            '/' + value.getDate();

        if (withTime) {
            result += ' ' + this.formatNumber(value.getHours()) + ':' + this.formatNumber(value.getMinutes())
        }

        return result
    }

    formatNumber(value: number) {
        let result = '';

        if (value > 10) {
            result += value;
        }
        else {
            result = '0' + value;
        }

        return result;
    }
}
