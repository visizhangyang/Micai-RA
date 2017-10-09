import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "transAsset"
})

export class TransAssetPipe implements PipeTransform {

    transform(code: string) {
        const translation = {
            FIXED_INCOME: '固收类',
            ALTERNATIVE: '另类投资',
            CASH: '现金类',
            STOCK: '股票类',
        };

        return translation[code] || code;
    }
}