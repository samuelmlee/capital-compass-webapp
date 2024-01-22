import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  Signal,
  effect
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { combineLatest, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs'
import { SnackbarService } from 'src/app/core/service/snack-bar.service'
import { TickersSearchConfig } from '../../model/tickers-search-config'
import { TickersService } from '../../service/tickers.service'

export type TickersFilterConfig = { fields: string[] }

@Component({
  selector: 'app-tickers-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './tickers-filter.component.html',
  styleUrl: './tickers-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TickersFilterComponent implements OnInit {
  @Input()
  public tickersFilterConfig: TickersFilterConfig = { fields: ['searchTerm', 'type', 'ticker'] }

  public formGroup: FormGroup
  public searchPlaceholder = 'Find by name, ticker or description'
  public tickerPlaceholder = 'Specify a ticker symbol'

  @Output('newSearchConfig')
  public configUpdatedEvent = new EventEmitter<TickersSearchConfig>()
  public $tickerTypes = this._tickersService.tickerTypesResult.value

  public searchTermControl = new FormControl('')
  public typeControl = new FormControl('')
  public tickerControl = new FormControl('', [Validators.maxLength(5)])

  private _$formValues: Signal<string[] | undefined> | undefined

  constructor(
    private _formBuilder: FormBuilder,
    private _tickersService: TickersService,
    private _snackBarService: SnackbarService,
    private _injector: Injector
  ) {
    this.formGroup = this._formBuilder.group({
      searchTerm: this.searchTermControl,
      type: this.typeControl,
      ticker: this.tickerControl
    })

    this.initFormValues()

    this.initFormValuesEffect()

    this.initTickerTypesErrorEffect()
  }

  public ngOnInit(): void {
    this._tickersService.fetchTickerTypes()
  }

  public clearControl(controlName: string): void {
    const control = this.formGroup.get(controlName)
    control?.setValue('')
    this.formGroup.updateValueAndValidity()
  }

  private initFormValues(): void {
    this._$formValues = toSignal(
      combineLatest([
        this.searchTermControl.valueChanges
          .pipe(debounceTime(500), distinctUntilChanged())
          .pipe(startWith('')),
        this.typeControl.valueChanges.pipe(distinctUntilChanged()).pipe(startWith('')),
        this.tickerControl.valueChanges
          .pipe(debounceTime(500), distinctUntilChanged())
          .pipe(startWith(''))
      ]).pipe(map(([searchTerm, type, ticker]) => [searchTerm ?? '', type ?? '', ticker ?? '']))
    )
  }

  private initTickerTypesErrorEffect(): void {
    effect(() => {
      const error = this._tickersService.tickerTypesResult.error()
      if (typeof error !== 'string' || !error) {
        return
      }
      this._snackBarService.error(error)
    })
  }

  private initFormValuesEffect(): void {
    effect(() => {
      if (!this.formGroup.valid) {
        return
      }
      if (!this._$formValues) {
        return
      }
      const [searchTerm = '', type = '', ticker = ''] = this._$formValues() || []
      const config: TickersSearchConfig = { searchTerm, type, symbol: ticker }
      this.configUpdatedEvent.emit(config)
    })
  }
}
