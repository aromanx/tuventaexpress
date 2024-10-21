import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
})
export class VentasPage implements OnInit {
  clients: any[] = [];
  products: any[] = [];
  selectedClientId: number | null = null;
  selectedProductId: number | null = null;
  selectedProduct: any = null;
  quantity: number | null = null;
  cart: any[] = [];
  total: number = 0;

  constructor(private alertCtrl: AlertController) {}

  ngOnInit() {
    this.loadClients();
    this.loadProducts();
  }

  loadClients() {
    const storedClients = JSON.parse(localStorage.getItem('clients') || '[]');
    this.clients = storedClients;
  }

  loadProducts() {
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    this.products = storedProducts;
  }

  loadSelectedProduct() {
    this.selectedProduct = this.products.find(p => p.id === this.selectedProductId);
  }

  getAvailableQuantity(productId: number): number {
    const product = this.products.find(p => p.id === productId);
    const cartItem = this.cart.find(item => item.id === productId);
    const quantityInCart = cartItem ? cartItem.cantidad : 0;
    return product ? product.cantidad - quantityInCart : 0;
  }

  async addToCart() {
    if (!this.selectedProduct || !this.quantity) return;

    const availableQuantity = this.getAvailableQuantity(this.selectedProduct.id);

    if (this.quantity > availableQuantity) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: `No hay suficiente cantidad disponible. Cantidad máxima: ${availableQuantity}`,
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const existingItem = this.cart.find(item => item.id === this.selectedProduct.id);
    if (existingItem) {
      existingItem.cantidad += this.quantity;
    } else {
      const cartItem = {
        ...this.selectedProduct,
        cantidad: this.quantity
      };
      this.cart.push(cartItem);
    }

    this.updateTotal();
    this.resetSelection();
  }

  updateTotal() {
    this.total = this.cart.reduce((sum, item) => sum + (item.precioVenta * item.cantidad), 0);
  }

  resetSelection() {
    this.selectedProduct = null;
    this.selectedProductId = null;
    this.quantity = null;
  }

  async editCartItem(item: any) {
    const availableQuantity = this.getAvailableQuantity(item.id) + item.cantidad;

    const alert = await this.alertCtrl.create({
      header: 'Editar Cantidad',
      inputs: [
        {
          name: 'cantidad',
          type: 'number',
          value: item.cantidad.toString(),
          min: 1,
          max: availableQuantity
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            const newQuantity = parseInt(data.cantidad, 10);
            if (newQuantity <= availableQuantity) {
              item.cantidad = newQuantity;
              this.updateTotal();
              return true; // Indicate success
            } else {
              this.showQuantityError(availableQuantity);
              return false; // Prevent the alert from closing
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async showQuantityError(availableQuantity: number) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: `No hay suficiente cantidad disponible. Cantidad máxima: ${availableQuantity}`,
      buttons: ['OK']
    });
    await alert.present();
  }

  removeFromCart(item: any) {
    this.cart = this.cart.filter(cartItem => cartItem.id !== item.id);
    this.updateTotal();
  }

  async processSale() {
    if (!this.selectedClientId || !this.cart.length) return;

    const ticket = {
      id: Date.now(),
      clienteId: this.selectedClientId,
      fecha: new Date().toISOString(),
      productos: this.cart.map(item => ({
        id: item.id,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precioVenta: item.precioVenta,
        precioCosto: item.precioCosto
      })),
      total: this.total
    };

    const storedTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    storedTickets.push(ticket);
    localStorage.setItem('tickets', JSON.stringify(storedTickets));

    this.updateInventory();
    this.resetCart();

    const alert = await this.alertCtrl.create({
      header: 'Venta Realizada',
      message: 'La venta ha sido procesada exitosamente.',
      buttons: ['OK']
    });

    await alert.present();
  }

  updateInventory() {
    this.cart.forEach(item => {
      const productIndex = this.products.findIndex(p => p.id === item.id);
      if (productIndex > -1) {
        this.products[productIndex].cantidad -= item.cantidad;
      }
    });
    localStorage.setItem('products', JSON.stringify(this.products));
  }

  resetCart() {
    this.cart = [];
    this.total = 0;
    this.selectedClientId = null;
  }
}