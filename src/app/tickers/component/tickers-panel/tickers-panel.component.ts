import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Signal, signal } from '@angular/core'
import { TickersSearchConfig } from '../../model/tickers-search-config'
import { TickersFilterComponent } from '../tickers-filter/tickers-filter.component'
import { TickersTableComponent } from '../tickers-table/tickers-table.component'

@Component({
  selector: 'app-tickers-panel',
  standalone: true,
  imports: [CommonModule, TickersFilterComponent, TickersTableComponent],
  templateUrl: './tickers-panel.component.html',
  styleUrl: './tickers-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TickersPanelComponent {
  private _searchConfig = signal<TickersSearchConfig>({})

  public get searchConfig(): Signal<TickersSearchConfig> {
    return this._searchConfig.asReadonly()
  }

  public updateSearchConfig(config: TickersSearchConfig): void {
    this._searchConfig.set(config)
  }
}
