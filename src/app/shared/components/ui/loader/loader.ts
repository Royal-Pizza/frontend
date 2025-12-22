import { Component, inject, computed } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from '../../../services/loader-service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './loader.html',
  styleUrls: ['./loader.css'],
})
export class LoaderComponent {
  private readonly loaderService = inject(LoaderService);
  public readonly isLoading = computed(() => this.loaderService.isLoading());
}