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
    expect(component.characterCount).toBe(0);
    expect(component.remainingCharacters).toBe(230);
  });

  it('should calculate character count correctly', () => {
    component.value = 'Hello World';
    expect(component.characterCount).toBe(11);
    expect(component.remainingCharacters).toBe(219);
  });

  it('should identify near limit state', () => {
    component.value = 'a'.repeat(215); // 215 characters, 15 remaining
    expect(component.isNearLimit).toBe(true);
    expect(component.isAtLimit).toBe(false);
  });

  it('should identify at limit state', () => {
    component.value = 'a'.repeat(230); // exactly at limit
    expect(component.isNearLimit).toBe(true);
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
