import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAreaWithCounter } from './text-area-with-counter';

describe('TextAreaWithCounter', () => {
  let component: TextAreaWithCounter;
  let fixture: ComponentFixture<TextAreaWithCounter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextAreaWithCounter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextAreaWithCounter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.value).toBe('');
    expect(component.maxLength).toBe(230);
    expect(component.warningThreshold).toBe(20);
    expect(component.characterCount).toBe(0);
    expect(component.remainingCharacters).toBe(230);
  });

  it('should work with custom maxLength values', () => {
    component.maxLength = 100;
    component.value = 'a'.repeat(50);
    expect(component.characterCount).toBe(50);
    expect(component.remainingCharacters).toBe(50);
  });

  it('should work with very small maxLength values', () => {
    component.maxLength = 10;
    component.value = 'hello';
    expect(component.characterCount).toBe(5);
    expect(component.remainingCharacters).toBe(5);
  });

  it('should handle edge case with maxLength of 1', () => {
    component.maxLength = 1;
    component.value = 'a';
    expect(component.characterCount).toBe(1);
    expect(component.remainingCharacters).toBe(0);
    expect(component.isAtLimit).toBe(true);
  });

  it('should use custom warning threshold', () => {
    component.maxLength = 100;
    component.warningThreshold = 10;
    component.value = 'a'.repeat(95); // 5 remaining, should trigger warning
    expect(component.isNearLimit).toBe(true);
    expect(component.isAtLimit).toBe(false);
  });

  it('should calculate character count correctly', () => {
    component.value = 'Hello World';
    expect(component.characterCount).toBe(11);
    expect(component.remainingCharacters).toBe(219);
  });

  it('should identify near limit state with default threshold', () => {
    component.value = 'a'.repeat(215); // 15 remaining, within default 20 threshold
    expect(component.isNearLimit).toBe(true);
    expect(component.isAtLimit).toBe(false);
  });

  it('should identify at limit state', () => {
    component.value = 'a'.repeat(230); // exactly at limit
    expect(component.isNearLimit).toBe(false); // at limit, not near limit
    expect(component.isAtLimit).toBe(true);
  });

  it('should enforce max length on input', () => {
    const mockEvent = {
      target: {
        value: 'a'.repeat(250) // 250 characters, should be trimmed to 230
      }
    } as any;

    component.onInput(mockEvent);
    
    expect(component.value.length).toBe(230);
    expect(mockEvent.target.value.length).toBe(230);
  });

  it('should enforce custom max length on input', () => {
    component.maxLength = 50;
    const mockEvent = {
      target: {
        value: 'a'.repeat(100) // 100 characters, should be trimmed to 50
      }
    } as any;

    component.onInput(mockEvent);
    
    expect(component.value.length).toBe(50);
    expect(mockEvent.target.value.length).toBe(50);
  });

  it('should handle zero or negative maxLength gracefully', () => {
    component.maxLength = 0;
    const mockEvent = {
      target: {
        value: 'test'
      }
    } as any;

    component.onInput(mockEvent);
    
    // Should enforce minimum of 1 character
    expect(component.value.length).toBe(1);
  });

  it('should emit textChange event on input', () => {
    spyOn(component.textChange, 'emit');
    
    const mockEvent = {
      target: {
        value: 'test'
      }
    } as any;

    component.onInput(mockEvent);
    
    expect(component.textChange.emit).toHaveBeenCalledWith('test');
  });
});
