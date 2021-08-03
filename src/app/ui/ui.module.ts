import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input/input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidationErrorComponent } from './validation-error/validation-error.component';

@NgModule({
  declarations: [InputComponent, ValidationErrorComponent],
  exports: [InputComponent, ValidationErrorComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class UiModule {}
