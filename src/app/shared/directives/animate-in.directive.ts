import {
  AnimationMetadata,
  AnimationPlayer,
  AnimationBuilder,
  AnimationFactory,
  style,
  animate,
} from '@angular/animations';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[fcAnimateIn]',
})
export class AnimateInDirective implements AfterViewInit {
  @Input() animationDirection:
    | 'bottomToTop'
    | 'topToBottom'
    | 'leftToRight'
    | 'rightToLeft' = 'rightToLeft';
  @Input() size = '200px';
  @Input() delay = '600ms';
  @Input() animateInAnimation: AnimationMetadata | AnimationMetadata[];
  @Input() animation = 'cubic-bezier(0.35, 0, 0.25, 1)';
  @Output() animationDone = new EventEmitter<void>();

  hasAnimated = false;
  @HostListener('window:scroll', [])
  onScroll() {
    this.animate();
  }

  private animating: boolean;
  private player: AnimationPlayer;
  private defaults: any = {
    offset: 0,
  };

  constructor(
    private el: ElementRef,
    private animationBuilder: AnimationBuilder
  ) {}

  ngAfterViewInit(): void {
    if (!this.animateInAnimation) {
      const direction =
        this.animationDirection === 'bottomToTop' ||
        this.animationDirection === 'topToBottom'
          ? 'Y'
          : 'X';
      const offset =
        this.animationDirection === 'leftToRight' ||
        this.animationDirection === 'topToBottom'
          ? `-${this.size}`
          : `${this.size}`;

      this.animateInAnimation = [
        style({ opacity: 0, transform: `translate${direction}(${offset})` }),
        animate(
          `${this.delay} ${this.animation}`,
          style({ opacity: 1, transform: `translate${direction}(0)` })
        ),
      ];
    }
    this.initialize();
    this.animate();
  }

  private initialize(): void {
    let animation: AnimationFactory;

    if (!!this.animateInAnimation) {
      animation = this.animationBuilder.build(this.animateInAnimation);
    }

    this.player = animation.create(this.el.nativeElement);
    this.player.init();
  }

  private animate(): void {
    if (this.hasAnimated) {
      return;
    }
    const inView = this.isInViewport();

    if (!inView) this.animating = false;
    if (!inView || this.animating) return;

    this.player.play();
    this.animating = true;
    this.hasAnimated = true;
    this.player.onDone(() => {
      this.animationDone.emit();
      this.player.destroy();
    });
  }

  private isInViewport(): boolean {
    const bounding = this.el.nativeElement.getBoundingClientRect();
    const EXTRA_SCROLL_OFFSET = -100;
    let top =
      bounding.top +
      EXTRA_SCROLL_OFFSET -
      (window.innerHeight || document.documentElement.clientHeight);
    let bottom = bounding.top + bounding.height + this.defaults.offset;

    return top < 0 && bottom > 0;
  }
}
