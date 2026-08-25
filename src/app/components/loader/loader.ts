import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from '../../services/loaderService/loader-service';

@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './loader.html',
  imports: [MatProgressSpinnerModule, CommonModule],
  styleUrls: ['./loader.css'],
})
export class LoaderComponent implements OnInit {
  // Observable pour async pipe
  isLoading: boolean = false;

  constructor(private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.loaderService.isLoading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }
}
