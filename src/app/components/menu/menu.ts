import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../services/api/api';
import { Pizza } from '../../models/pizza.model';
import { HeaderComponent } from '../header/header';
import { FooterComponent } from '../footer/footer';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class MenuComponent implements OnInit {

  pizzas: Pizza[] = [];

  constructor(private router: Router, private apiService: ApiService) { 

  }

  ngOnInit(): void {
    this.loadPizzas();
  }

  loadPizzas(): void {
    this.apiService.getPizzas().subscribe({
      next: (data: Pizza[]) => this.pizzas = data,
      
      error: (err) => {
        console.error('Erreur chargement pizzas', err)
        
      }
    });
  }

  goToPizza(namePizza: string): void {
  this.router.navigate(['/menu', namePizza]); // ✅ correspond à la route définie
}

}
