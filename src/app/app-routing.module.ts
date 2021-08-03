import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/bmr/bmr.module').then((m) => m.BmrModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./modules/bmi/bmi.module').then((m) => m.BmiModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
