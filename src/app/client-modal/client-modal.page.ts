import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-client-modal',
  templateUrl: './client-modal.page.html',
  styleUrls: ['./client-modal.page.scss'],
})
export class ClientModalPage {
  @Input() client: any;
  clientData = {
    nombre: '',
    direccion: '',
    telefono: '',
    urlFotografia: ''
  };

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    if (this.client) {
      this.clientData = { ...this.client }; // Copiar datos del cliente existente
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  saveClient() {
    this.modalCtrl.dismiss(this.clientData);
  }
}
