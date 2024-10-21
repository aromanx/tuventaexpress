import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ProductModalPage } from '../product-modal/product-modal.page';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchTerm: string = '';

  constructor(private alertCtrl: AlertController, private modalCtrl: ModalController) {
    this.loadProducts();
  }

  trackById(index: number, product: any): number {
    return product.id;
  }

  loadProducts() {
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    this.products = storedProducts;
    this.filteredProducts = [...this.products];
  }

  filterProducts() {
    this.filteredProducts = this.products.filter((product) =>
      product.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  async deleteProduct(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.products = this.products.filter((p) => p.id !== id);
            localStorage.setItem('products', JSON.stringify(this.products));
          },
        },
      ],
    });
    await alert.present();
  }

  async openProductModal(product: any = null) {
    const modal = await this.modalCtrl.create({
      component: ProductModalPage,
      componentProps: { product },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      if (data.id) {
        const index = this.products.findIndex((p) => p.id === data.id);
        if (index > -1) {
          this.products[index] = data;
        }
      } else {
        data.id = Date.now();
        this.products.push(data);
      }
      localStorage.setItem('products', JSON.stringify(this.products));
      this.loadProducts();
    }
  }

  editProduct(product: any) {
    this.openProductModal(product);
  }
}