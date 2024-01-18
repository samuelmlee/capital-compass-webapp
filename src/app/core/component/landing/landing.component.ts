import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NewsComponent } from 'src/app/news/component/news/news.component'

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, NewsComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent {}
