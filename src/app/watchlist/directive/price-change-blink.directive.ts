import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core'
import { ValueChange } from '../model/watchlist'

@Directive({
  selector: '[appPriceChangeBlink]',
  standalone: true
})
export class PriceChangeBlinkDirective implements OnChanges {
  @Input() public valueChange: ValueChange = { prevValue: 0, value: 0, initialValue: 0 }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  public ngOnChanges(): void {
    this.applyColor()
    this.triggerBlink()
  }

  private applyColor(): void {
    if (this.valueChange.value > this.valueChange.initialValue) {
      this.renderer.removeClass(this.el.nativeElement, 'value-down')
      this.renderer.addClass(this.el.nativeElement, 'value-up')
      return
    }
    if (this.valueChange.value < this.valueChange.initialValue) {
      this.renderer.removeClass(this.el.nativeElement, 'value-up')
      this.renderer.addClass(this.el.nativeElement, 'value-down')
      return
    }
    this.renderer.removeClass(this.el.nativeElement, 'value-up')
    this.renderer.removeClass(this.el.nativeElement, 'value-down')
  }

  private triggerBlink(): void {
    if (this.valueChange.value !== this.valueChange.prevValue) {
      this.renderer.addClass(this.el.nativeElement, 'blink')

      setTimeout(() => {
        this.renderer.removeClass(this.el.nativeElement, 'blink')
      }, 3000)
    }
  }
}
