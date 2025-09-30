import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-text-area-with-counter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './text-area-with-counter.html',
  styleUrl: './text-area-with-counter.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaWithCounter),
      multi: true
    }
  ]
})
export class TextAreaWithCounter implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() maxLength: number = 230;
  @Input() disabled: boolean = false;
  @Output() textChange = new EventEmitter<string>();

  value: string = '';
  
  private onChange = (value: string) => {};
  private onTouched = () => {};

  get characterCount(): number {
    return this.value.length;
  }

  get remainingCharacters(): number {
    return this.maxLength - this.characterCount;
  }

  get isNearLimit(): boolean {
    return this.remainingCharacters <= 20;
  }

  get isAtLimit(): boolean {
    return this.remainingCharacters <= 0;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    let newValue = target.value;
    
    // Enforce max length
    if (newValue.length > this.maxLength) {
      newValue = newValue.substring(0, this.maxLength);
      target.value = newValue;
    }
    
    this.value = newValue;
    this.onChange(this.value);
    this.textChange.emit(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
