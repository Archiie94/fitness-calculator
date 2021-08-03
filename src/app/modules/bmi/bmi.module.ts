import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BmiComponent } from './components/bmi/bmi.component';
import { BmiRoutingModule } from './bmr-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { UiModule } from 'src/app/ui/ui.module';

@NgModule({
  declarations: [BmiComponent],
  imports: [
    CommonModule,
    BmiRoutingModule,
    SharedModule,
    UiModule,
    ReactiveFormsModule,
    FormsModule,
    MatRippleModule,
  ],
})
export class BmiModule {}
