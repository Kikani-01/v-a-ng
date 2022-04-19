import {PipeTransform, Pipe} from '@angular/core';
import * as numeral from 'numeral';

@Pipe({
    name: 'outputnumber'
})
export class OutputNumberPipe implements PipeTransform {
    constructor() {
    }

    transform(value, args) {
        if (value == undefined || value == null || value == '') {
            return null;
        } else {
            let num = numeral(value);
            return num.format('0');
        }
    }
}
