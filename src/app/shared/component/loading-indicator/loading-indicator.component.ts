import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { LoadingService } from 'src/app/core/service/loading.service'

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading-indicator.component.html',
  styleUrl: './loading-indicator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingIndicatorComponent {
  public $loading = this._loadingService.$loading

  constructor(private _loadingService: LoadingService) {}
}
