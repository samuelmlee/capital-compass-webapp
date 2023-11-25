import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, EventEmitter, Output, Signal, effect } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { combineLatest, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs'
import { TickersSearchConfig } from '../../model/tickers-search-config'

@Component({
  selector: 'app-tickers-filter',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './tickers-filter.component.html',
  styleUrl: './tickers-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TickersFilterComponent {
  public formGroup: FormGroup
  public searchPlaceholder = 'Find by name, ticker or description'

  @Output('newConfig')
  public configUpdatedEvent = new EventEmitter<TickersSearchConfig>()

  private _searchTermControl = new FormControl('')
  private _typeControl = new FormControl('')
  private _formValues: Signal<string[] | undefined>

  public constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      searchTerm: this._searchTermControl,
      type: this._typeControl
    })

    this._formValues = toSignal(
      combineLatest([
        this._searchTermControl.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).pipe(startWith('')),
        this._typeControl.valueChanges.pipe(distinctUntilChanged()).pipe(startWith(''))
      ]).pipe(map(([searchTerm, type]) => [searchTerm ?? '', type ?? '']))
    )

    effect(() => {
      const [searchTerm = '', type = ''] = this._formValues() || []
      if (this.formGroup.valid) {
        const config: TickersSearchConfig = { searchTerm, type }
        this.configUpdatedEvent.emit(config)
      }
    })
  }
}
