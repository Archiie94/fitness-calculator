import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BmrComponent } from './components/bmr/bmr.component';

const routes: Routes = [
  {
    path: 'bmr',
    component: BmrComponent,
  },
  {
    path: '',
    redirectTo: 'bmr',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BmrRoutingModule {}
