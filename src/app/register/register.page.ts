import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  newUser = {
    name: '',
    username: '',
    password: '',
    shopName: '',
    shopImage: ''
  };

  constructor(private modalCtrl: ModalController) {}

  registerUser() {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push({ id: Date.now(), ...this.newUser });
    localStorage.setItem('users', JSON.stringify(users));
    this.dismiss();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
