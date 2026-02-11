import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxEchartsModule } from 'ngx-echarts';

import { AppComponent } from './app.component';
import { AxisPositioningComponent } from './axis-positioning/axis-positioning.component';
import { DualAxisPositioningComponent } from './dual-axis-positioning/dual-axis-positioning.component';

@NgModule({
  declarations: [
    AppComponent,
    AxisPositioningComponent,
    DualAxisPositioningComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
