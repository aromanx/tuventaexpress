import { Component } from '@angular/core';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage {
  startDate: string = '';
  endDate: string = '';
  sales: any[] = [];
  filteredSales: any[] = [];
  totalVentas: number = 0;
  totalCosto: number = 0;
  ganancia: number = 0;
  reportGenerated: boolean = false;
  
  constructor() {
    this.loadSales();
  }

  // Cargar ventas desde localStorage
  loadSales() {
    const storedSales = JSON.parse(localStorage.getItem('tickets') || '[]');
    this.sales = storedSales;
  }

  // Generar reporte filtrando las ventas por el periodo seleccionado
  generateReport() {
    if (!this.startDate || !this.endDate) return;

    const start = new Date(this.startDate).getTime();
    const end = new Date(this.endDate).getTime();

    this.filteredSales = this.sales.filter(sale => {
      const saleDate = new Date(sale.fecha).getTime();
      return saleDate >= start && saleDate <= end;
    });

    // Calcular totales de ventas, costo y ganancias
    this.calculateTotals();
    this.reportGenerated = true;
  }

  // Calcular totales
  calculateTotals() {
    this.totalVentas = 0;
    this.totalCosto = 0;
    this.ganancia = 0;
    

    this.filteredSales.forEach(sale => {
      
      sale.productos.forEach((product: { precioVenta: number; cantidad: number; precioCosto: number; }): void => {
        this.totalVentas += product.precioVenta * product.cantidad;
        
        this.totalCosto += product.precioCosto * product.cantidad;
      });
    });

    this.ganancia = this.totalVentas - this.totalCosto;
  }
}
