import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
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
  public tickerTypes = this._tickersService.tickerTypesSignal
  public searchTermControl = new FormControl('')
  public typeControl = new FormControl('')
  public tickerControl = new FormControl('', [Validators.maxLength(5)])

  private _formValues: Signal<string[] | undefined> | undefined

  constructor(
    private _formBuilder: FormBuilder,
    private _tickersService: TickersService
  ) {
    this.formGroup = this._formBuilder.group({
      searchTerm: this.searchTermControl,
      type: this.typeControl,
      ticker: this.tickerControl
    })

    this.initFormValues()

    effect(() => {
      if (!this.formGroup.valid) {
        return
      }
      if (!this._formValues) {
        return
      }
      const [searchTerm = '', type = '', ticker = ''] = this._formValues() || []
      const config: TickersSearchConfig = { searchTerm, type, symbol: ticker }
      this.configUpdatedEvent.emit(config)
    })
  }

  public ngOnInit(): void {
    this._tickersService.fetchTickerTypes()
  }

  private initFormValues(): void {
    this._formValues = toSignal(
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

  public clearControl(controlName: string): void {
    const control = this.formGroup.get(controlName)
    control?.setValue('')
    this.formGroup.updateValueAndValidity()
  }
}
