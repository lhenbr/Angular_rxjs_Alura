import { merge, Observable, Subscription } from 'rxjs';
import { AcoesService } from './acoes.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
const ESPERA_DIGITAÇAO = 300;
@Component({
  selector: 'app-acoes',
  templateUrl: './acoes.component.html',
  styleUrls: ['./acoes.component.css'],
})
export class AcoesComponent {

  acoesInput = new FormControl();
  todasAcoes$ = this.acoesService.getAcoes().pipe(tap(() => { console.log('fluco inicial'); }));
  filtroPeloInput$ = this.acoesInput.valueChanges.pipe(
    debounceTime(ESPERA_DIGITAÇAO),
    tap(() => {
      console.log('fuxo do filtro');
    }),
    tap(console.log),
    filter(valorDigitado => valorDigitado.length >= 3 || !valorDigitado.length),
    distinctUntilChanged(),
    tap(console.log),
    switchMap(
      valordigitado => this.acoesService.getAcoes((valordigitado))));

  acoes$ = merge(this.todasAcoes$, this.filtroPeloInput$);

  constructor(
    private acoesService: AcoesService
  ) { }

}
