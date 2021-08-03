import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { AnimateInDirective } from './directives/animate-in.directive';

@NgModule({
  declarations: [AnimateInDirective],
  exports: [MatSelectModule, MatRadioModule, AnimateInDirective],
  imports: [CommonModule, MatSelectModule, MatRadioModule],
})
export class SharedModule {}
