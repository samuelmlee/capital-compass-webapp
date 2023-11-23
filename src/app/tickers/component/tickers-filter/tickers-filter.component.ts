import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, Signal, effect } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { debounceTime, distinctUntilChanged } from 'rxjs'
import { TickersSearchConfig } from '../../model/tickers-search-config'

@Component({
  selector: 'app-tickers-filter',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './tickers-filter.component.html',
  styleUrl: './tickers-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TickersFilterComponent implements OnInit {
  public formGroup: FormGroup
  public searchPlaceholder = 'Find by name, ticker or description'

  @Output('newConfig')
  private configUpdatedEvent = new EventEmitter<TickersSearchConfig>()

  private searchTermControl = new FormControl('')
  private typeControl = new FormControl('')
  private searchTermSignal: Signal<string | null>

  public constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      searchTerm: this.searchTermControl,
      type: this.typeControl
    })

    this.searchTermSignal = toSignal(
      this.searchTermControl.valueChanges.pipe(debounceTime(500), distinctUntilChanged()),
      { initialValue: '' }
    )

    effect(
      () => {
        this.emitSearchConfig()
      },
      { allowSignalWrites: true }
    )
  }

  private emitSearchConfig(): void {
    if (this.formGroup.valid) {
      const config: TickersSearchConfig = {
        searchTerm: this.searchTermSignal() ?? '',
        type: this.typeControl.value ?? ''
      }
      this.configUpdatedEvent.emit(config)
    }
  }

  public ngOnInit(): void {}
}
