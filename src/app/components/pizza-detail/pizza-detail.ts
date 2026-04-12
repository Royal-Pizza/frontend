import { Component, OnInit } from '@angular/core';
import { Pizza } from '../../models/pizza.model';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pizza-detail',
  imports: [CommonModule],
  templateUrl: './pizza-detail.html',
  styleUrls: ['./pizza-detail.css']
})
export class PizzaDetailComponent implements OnInit {
  pizza?: Pizza;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {

  }

  ngOnInit(): void {
    const namePizza = this.route.snapshot.paramMap.get('namePizza');
    console.log("namePizza = " + namePizza);
    this.apiService.getPizzaById(namePizza).subscribe({
      next: (data) => this.pizza = data,
      error: (err) => console.error('Erreur chargement pizza', err)
    });
  }
}
