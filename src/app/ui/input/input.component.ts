import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'fc-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  @Input() control: FormControl;
  @Input() label: string;
  @Input() inputId = '';
  @Input() inputType: 'textarea' | 'text' | 'password' | 'file' = 'text';
  @Input() placeholder = '';
  @Input() min = -1;
  @Input() max = -1;
  required = false;
  focus = false;

  ngOnInit(): void {
    !this.control &&
      console.error(`Input with id ${this.inputId} is missing a formControl.`);

    this.required = this.isRequired();
  }

  onInput(): void {
    this.control.markAsUntouched();
  }

  onBlur(): void {
    const val: string = this.trimString(this.control.value);
    this.control.patchValue(val, { emitEvent: false });
    this.focus = false;
  }

  onFocus(): void {
    this.focus = true;
  }

  private trimString(val: string): string {
    return val.trim();
  }

  private isRequired(): boolean {
    if (this.control.validator) {
      const validator = this.control.validator({} as AbstractControl);
      return validator && validator.required;
    }
    return false;
  }
}
