import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from '../../../services/tools/loader/loader-service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.html',
  imports: [MatProgressSpinnerModule, CommonModule],
  styleUrls: ['./loader.css'],
})
export class LoaderComponent implements OnInit {
  // Observable pour async pipe
  isLoading: boolean = false;

  private loaderService = inject(LoaderService);

  ngOnInit() {
    this.loaderService.isLoading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }
}
