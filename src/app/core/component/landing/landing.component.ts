import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ChartComponent } from '../../../shared/component/chart/chart.component'

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, ChartComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent {}
