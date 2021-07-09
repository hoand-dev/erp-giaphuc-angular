import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sumTotal'
})
export class SumTotalPipe implements PipeTransform {
    transform(items: any[], attr: string): number {
        let sum = 0;
        if (attr) {
            sum = items.reduce((sum, x) => sum += x[attr], 0);
        } else {
            sum = items.reduce((sum, x) => sum += x, 0);
        }
        return sum;
        //return items.reduce((a, b) => a + b[attr], 0);
    }
}
