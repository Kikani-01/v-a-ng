import { PipeTransform, Pipe } from '@angular/core';
import * as moment from 'moment/moment';

@Pipe({
  name: 'outputdatetime',
})
export class OutputDateTimePipe implements PipeTransform {
  constructor() {}

  transform(value: string, showTime?: boolean) {
    if (value == undefined || value == null || value == '') {
      return null;
    } else {
      let st = true;
      if (showTime == false) {
        st = false;
      }
      return this.formatDateTime(value, st);
    }
  }

  private formatDateTime(value: string, showTime: boolean): string {
    if (value) {
      try {
        let val: string = '';
        if (typeof value === 'string') {
          val = value;
          // } else if (typeof value === 'Date') {
          //     return moment(value).format('DD/MM/YYYY');
        } else if (typeof value === 'number') {
          val = moment(value).format('YYYY-MM-DD[T]HH:mm:ss');
        } else {
          val = value;
        }
        let p: string[] = val.split('T');
        if (p.length != 2) {
          return null!;
        }

        let c: string[] = p[0].split('-');
        if (c.length != 3) {
          return null!;
        }
        let t: string[] = p[1].split(':');
        if (t.length != 3) {
          return null!;
        }
        if (showTime == true) {
          return this.composeDate(c[0], c[1], c[2]) + ' ' + t[0] + ':' + t[1];
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
