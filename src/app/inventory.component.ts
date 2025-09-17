import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Inventory</h1>
        <p>Track your restaurant inventory</p>
      </div>
      <mat-card class="content-card">
        <h2>Inventory Management</h2>
        <p>Inventory feature coming soon...</p>
      </mat-card>
    </div>
  `,
  styles: [`
    .page { padding: 1.5rem; }
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.75rem; font-weight: 600; color: #009c4c; margin: 0 0 0.25rem 0; font-family: 'Montserrat', sans-serif; }
    .page-header p { color: #666; margin: 0; font-family: 'Montserrat', sans-serif; }
    .content-card { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); }
    .content-card h2 { font-size: 1.25rem; font-weight: 600; color: #009c4c; margin: 0 0 0.5rem 0; font-family: 'Montserrat', sans-serif; }
    .content-card p { color: #666; margin: 0; font-family: 'Montserrat', sans-serif; }
  `]
})
export class InventoryComponent {}