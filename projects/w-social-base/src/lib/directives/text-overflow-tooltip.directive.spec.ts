import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TextOverflowTooltipDirective } from './text-overflow-tooltip.directive';

@Component({
  template: `
    <div 
      wTextOverflowTooltip 
      [width]="width" 
      [maxWidth]="maxWidth"
      [style.font-size]="fontSize"
      data-testid="tooltip-element">
      {{ text }}
    </div>
  `,
  standalone: true,
  imports: [TextOverflowTooltipDirective]
})
class TestComponent {
  text = 'This is a test text that might overflow';
  width?: string;
  maxWidth?: string;
  fontSize = '16px';
}

describe('TextOverflowTooltipDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let debugElement: DebugElement;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestComponent,
        MatTooltipModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement.query(By.css('[data-testid="tooltip-element"]'));
    element = debugElement.nativeElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(debugElement).toBeTruthy();
  });

  it('should apply CSS styles for text overflow', () => {
    fixture.detectChanges();
    
    const computedStyle = window.getComputedStyle(element);
    expect(computedStyle.overflow).toBe('hidden');
    expect(computedStyle.whiteSpace).toBe('nowrap');
    expect(computedStyle.textOverflow).toBe('ellipsis');
  });

  it('should apply width when provided', () => {
    component.width = '200px';
    fixture.detectChanges();
    
    const computedStyle = window.getComputedStyle(element);
    expect(computedStyle.width).toBe('200px');
  });

  it('should apply max-width when provided', () => {
    component.maxWidth = '300px';
    fixture.detectChanges();
    
    const computedStyle = window.getComputedStyle(element);
    expect(computedStyle.maxWidth).toBe('300px');
  });

  it('should apply both width and max-width when provided', () => {
    component.width = '200px';
    component.maxWidth = '300px';
    fixture.detectChanges();
    
    const computedStyle = window.getComputedStyle(element);
    expect(computedStyle.width).toBe('200px');
    expect(computedStyle.maxWidth).toBe('300px');
  });

  it('should change display to inline-block if element is inline', () => {
    // Set element to inline first
    element.style.display = 'inline';
    fixture.detectChanges();
    
    const computedStyle = window.getComputedStyle(element);
    expect(computedStyle.display).toBe('inline-block');
  });

  it('should handle text content changes', () => {
    fixture.detectChanges();
    
    // Change text content
    component.text = 'New text content';
    fixture.detectChanges();
    
    expect(element.textContent).toBe('New text content');
  });

  it('should handle empty text content', () => {
    component.text = '';
    fixture.detectChanges();
    
    expect(element.textContent).toBe('');
  });

  it('should not fail when ResizeObserver is not available', () => {
    // Mock ResizeObserver as undefined
    const originalResizeObserver = (global as any).ResizeObserver;
    (global as any).ResizeObserver = undefined;
    
    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
    
    // Restore ResizeObserver
    (global as any).ResizeObserver = originalResizeObserver;
  });

  it('should not fail when MutationObserver is not available', () => {
    // Mock MutationObserver as undefined
    const originalMutationObserver = (global as any).MutationObserver;
    (global as any).MutationObserver = undefined;
    
    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
    
    // Restore MutationObserver
    (global as any).MutationObserver = originalMutationObserver;
  });
});