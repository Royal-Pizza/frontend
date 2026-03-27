import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../services/api';
import { Pizza } from '../../models/pizza.model';
import { HeaderComponent } from '../header/header';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class MenuComponent implements OnInit {

  pizzas: Pizza[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadPizzas();
  }

  loadPizzas(): void {
    this.apiService.getPizzas().subscribe({
      next: (data: Pizza[]) => this.pizzas = data,
      error: (err) => console.error('Erreur chargement pizzas', err)
    });
  }
}
