import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Renderer2,
  ChangeDetectorRef
} from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

/**
 * Directive that displays a MatTooltip whenever text overflows the element.
 * Automatically handles CSS setup and overflow detection.
 * 
 * Usage:
 * <div wTextOverflowTooltip [width]="'200px'" [maxWidth]="'300px'">Long text content</div>
 */
@Directive({
  selector: '[wTextOverflowTooltip]',
  standalone: true,
  hostDirectives: [
    {
      directive: MatTooltip,
      inputs: ['matTooltipPosition', 'matTooltipClass', 'matTooltipShowDelay', 'matTooltipHideDelay']
    }
  ]
})
export class TextOverflowTooltipDirective implements OnInit, AfterViewInit, OnDestroy {
  @Input() width?: string;
  @Input() maxWidth?: string;

  private resizeObserver?: ResizeObserver;
  private mutationObserver?: MutationObserver;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private matTooltip: MatTooltip,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setupCssStyles();
  }

  ngAfterViewInit(): void {
    this.checkOverflow();
    this.setupObservers();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private setupCssStyles(): void {
    const element = this.elementRef.nativeElement;
    
    // Apply necessary CSS for text overflow detection
    this.renderer.setStyle(element, 'overflow', 'hidden');
    this.renderer.setStyle(element, 'white-space', 'nowrap');
    this.renderer.setStyle(element, 'text-overflow', 'ellipsis');
    
    // Apply width/max-width if provided
    if (this.width) {
      this.renderer.setStyle(element, 'width', this.width);
    }
    
    if (this.maxWidth) {
      this.renderer.setStyle(element, 'max-width', this.maxWidth);
    }
    
    // Ensure the element has a display property that supports width
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.display === 'inline') {
      this.renderer.setStyle(element, 'display', 'inline-block');
    }
  }

  private checkOverflow(): void {
    const element = this.elementRef.nativeElement;
    const isOverflowing = element.scrollWidth > element.clientWidth;
    
    if (isOverflowing) {
      // Set tooltip message to the full text content
      const textContent = element.textContent || element.innerText || '';
      this.matTooltip.message = textContent;
      this.matTooltip.disabled = false;
    } else {
      // Disable tooltip when not overflowing
      this.matTooltip.disabled = true;
    }
    
    // Trigger change detection to update tooltip state
    this.cdr.detectChanges();
  }

  private setupObservers(): void {
    const element = this.elementRef.nativeElement;
    
    // Set up ResizeObserver to detect size changes
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.checkOverflow();
      });
      this.resizeObserver.observe(element);
    }
    
    // Set up MutationObserver to detect text content changes
    if (typeof MutationObserver !== 'undefined') {
      this.mutationObserver = new MutationObserver(() => {
        this.checkOverflow();
      });
      this.mutationObserver.observe(element, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  }

  private cleanup(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
    
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = undefined;
    }
  }
}