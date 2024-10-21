// product-modal.page.ts
import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.page.html',
  styleUrls: ['./product-modal.page.scss'],
})
export class ProductModalPage {
  @Input() product: any;
  productData = {
    nombre: '',
    descripcion: '',
    cantidad: 0,
    precioCosto: 0,
    precioVenta: 0,
    urlFotografia: ''
  };

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    if (this.product) {
      this.productData = { ...this.product };
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  saveProduct() {
    this.modalCtrl.dismiss(this.productData);
  }
}