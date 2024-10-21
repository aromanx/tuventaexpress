import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ClientModalPage } from '../client-modal/client-modal.page';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage {
  clients: Cliente[] = [];
  filteredClients: Cliente[] = [];
  searchTerm: string = '';

  constructor(private alertCtrl: AlertController, private modalCtrl: ModalController) {
    this.loadClients();
  }

  // Cargar clientes desde localStorage
  loadClients() {
    const storedClients = JSON.parse(localStorage.getItem('clients') || '[]');
    this.clients = storedClients;
    this.filteredClients = [...this.clients];
  }

  // Filtrar clientes por nombre
  filterClients() {
    this.filteredClients = this.clients.filter(client =>
      client.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Eliminar cliente
  async deleteClient(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este cliente?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.clients = this.clients.filter(c => c.id !== id);
            localStorage.setItem('clients', JSON.stringify(this.clients));
            this.loadClients();
          }
        }
      ]
    });
    await alert.present();
  }

  // Abrir modal para agregar o editar cliente
  async openClientModal(client?: Cliente) {
    const modal = await this.modalCtrl.create({
      component: ClientModalPage,
      componentProps: { client }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      if (data.id) {
        // Editar cliente existente
        const index = this.clients.findIndex(c => c.id === data.id);
        if (index > -1) {
          this.clients[index] = data;
        }
      } else {
        // Agregar nuevo cliente
        data.id = Date.now();  // Generar un ID único
        this.clients.push(data);
      }
      localStorage.setItem('clients', JSON.stringify(this.clients));
      this.loadClients();
    }
  }

  // Editar cliente
  editClient(client: Cliente) {
    this.openClientModal(client);
  }
}

interface Cliente {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  urlFotografia: string;
}