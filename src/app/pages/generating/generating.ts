import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-generating',
  styleUrl: './generating.scss',
  templateUrl: './generating.html',
})
export class Generating implements OnInit {
  private router = inject(Router);

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/results']);
    }, 3000);
  }
}
