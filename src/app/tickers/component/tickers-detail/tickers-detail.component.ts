import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-tickers-detail',
  standalone: true,
  imports: [],
  templateUrl: './tickers-detail.component.html',
  styleUrl: './tickers-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TickersDetailComponent {

}
