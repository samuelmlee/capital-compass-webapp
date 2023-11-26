import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
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
  public searchConfig: TickersSearchConfig = { searchTerm: '', type: '' }

  public updateSearchConfig(config: TickersSearchConfig): void {
    this.searchConfig = { ...config }
  }
}
