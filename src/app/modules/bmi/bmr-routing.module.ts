import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BmiComponent } from './components/bmi/bmi.component';

const routes: Routes = [
  {
    path: 'bmi',
    component: BmiComponent,
  },
  {
    path: '',
    redirectTo: 'bmi',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BmiRoutingModule {}
