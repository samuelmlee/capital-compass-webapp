import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core'
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
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
  @Output('newConfig')
  public configUpdatedEvent = new EventEmitter<TickersSearchConfig>()

  public searchTermControl = new FormControl('')
  public typeControl = new FormControl('')
  public formGroup = this._formBuilder.group({
    searchTerm: this.searchTermControl,
    type: this.typeControl
  })

  public constructor(private _formBuilder: FormBuilder) {}
}
