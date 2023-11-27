import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, Signal, effect } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { combineLatest, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs'
import { TickersSearchConfig } from '../../model/tickers-search-config'
import { TickersService } from '../../service/tickers.service'

@Component({
  selector: 'app-tickers-filter',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './tickers-filter.component.html',
  styleUrl: './tickers-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TickersFilterComponent implements OnInit {
  public formGroup: FormGroup
  public searchPlaceholder = 'Find by name, ticker or description'
  public tickerPlaceholder = 'Specify a ticker symbol'

  @Output('newConfig')
  public configUpdatedEvent = new EventEmitter<TickersSearchConfig>()
  public tickerTypes = this.tickersService.tickerTypesSignal

  private _searchTermControl = new FormControl('')
  private _typeControl = new FormControl('')
  private _tickerControl = new FormControl('', [Validators.maxLength(5)])
  private _formValues: Signal<string[] | undefined> | undefined

  public constructor(
    private formBuilder: FormBuilder,
    private tickersService: TickersService
  ) {
    this.formGroup = this.formBuilder.group({
      searchTerm: this._searchTermControl,
      type: this._typeControl,
      ticker: this._tickerControl
    })

    this.initFormValues()

    effect(() => {
      if (!this.formGroup.valid || !this._formValues) {
        return
      }
      const [searchTerm = '', type = '', ticker = ''] = this._formValues() || []
      const config: TickersSearchConfig = { searchTerm, type, ticker }
      this.configUpdatedEvent.emit(config)
    })
  }

  public ngOnInit(): void {
    this.tickersService.fetchTickerTypes()
  }

  private initFormValues(): void {
    this._formValues = toSignal(
      combineLatest([
        this._searchTermControl.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).pipe(startWith('')),
        this._typeControl.valueChanges.pipe(distinctUntilChanged()).pipe(startWith('')),
        this._tickerControl.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).pipe(startWith(''))
      ]).pipe(map(([searchTerm, type, ticker]) => [searchTerm ?? '', type ?? '', ticker ?? '']))
    )
  }

  public clearControl(controlName: string): void {
    const control = this.formGroup.get(controlName)
    control?.setValue('')
  }
}
