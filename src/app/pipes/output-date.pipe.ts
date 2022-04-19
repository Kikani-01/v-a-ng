import { PipeTransform, Pipe } from '@angular/core';
import * as moment from 'moment/moment';

@Pipe({
  name: 'outputdate',
})
export class OutputDatePipe implements PipeTransform {
  constructor() {}

  transform(value: any, args: any) {
    if (value == undefined || value == null || value == '') {
      return null;
    } else {
      return this.formatDate(value);
    }
  }

  private formatDate(value: any): string {
    if (value) {
      try {
        let cs: string = '';
        if (typeof value === 'string') {
          cs = value;
          // } else if (typeof value === 'Date') {
          //     return moment(value).format('DD/MM/YYYY');
        } else if (typeof value === 'number') {
          return moment(value).format('DD/MM/YYYY');
        } else {
          cs = value.toString();
        }

        let c: string[] | undefined = cs?.split('-');
        if (c?.length != 3) {
          return null!;
        }
        return this.composeDate(c[0], c[1], c[2]);
      } catch (e) {
        console.log(e);
      }
    }
    return null!;
  }

  private composeDate(year: string, month: string, day: string): string {
    return day + '/' + month + '/' + year;
  }
}
