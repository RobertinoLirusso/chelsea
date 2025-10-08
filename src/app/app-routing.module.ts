import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoverComponent } from './components/cover/cover.component';
import { SliderComponent } from './components/slider/slider.component';

const routes: Routes = [
  { path: '', title: "Road to Munich", component: CoverComponent, pathMatch: 'full' },
  { path: 'matches', title: 'Matches', component: SliderComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
