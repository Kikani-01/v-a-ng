import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'positioning'
})
export class PositioningPipe implements PipeTransform {


  /*   
    ESEMPIO DI CODICE POSTAZIONE

    CIC100100301

    MF -> CI (magazzino fisico è il sito)
    ML -> C1 (cassone)
    SCA -> 001 (scaffale)
    PO -> 003 (piano)
    PI -> 01 (reparto)

    quello che deve mostrare la pipe

    S:001
    P:003
    R:01
  */
  transform(value: string): string {
    if (!value || value.length !== 12) {
      return '';
    }

    const pipeValue = 'S:' + value.substr(4, 3) +
      ' P:' + value.substr(7, 3) +
      ' R:' + value.substr(10, 2);

    return pipeValue;
  }

}
