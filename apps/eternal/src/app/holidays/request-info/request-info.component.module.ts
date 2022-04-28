import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RequestInfoComponent } from './request-info.component';

@NgModule({
  declarations: [RequestInfoComponent],
  exports: [RequestInfoComponent],
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatButtonModule]
})
export class RequestInfoComponentModule {}
