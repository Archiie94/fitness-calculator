import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BmrRoutingModule } from './bmr-routing.module';
import { BmrComponent } from './components/bmr/bmr.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UiModule } from 'src/app/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [BmrComponent],
  imports: [
    SharedModule,
    UiModule,
    CommonModule,
    BmrRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatRippleModule,
  ],
})
export class BmrModule {}
