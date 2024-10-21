import { Component } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { RegisterPage } from '../register/register.page';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  constructor(private navCtrl: NavController, private modalCtrl: ModalController) {
    this.checkRememberedUser();
  }

  login() {
    // Recuperamos los usuarios del localStorage o un array vacío si no hay nada guardado.
const users = JSON.parse(localStorage.getItem('users') || '[]');

// Aseguramos que 'users' sea un array antes de buscar.
if (Array.isArray(users)) {
  console.log("Si entro!!")
  console.log(this.username)
  console.log(this.password)
    // Buscamos el usuario que coincida con username y password.
    const user = users.find((u: { username: string, password: string }) => 
        u.username === this.username && u.password === this.password
    );
    
    console.log(users);
    console.log(user);
    if (user) {
      if (this.rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('rememberedUser');
      }
      this.navCtrl.navigateForward('/principal', { queryParams: { shopName: user.shopName, shopImage: user.shopImage } });
    } else {
      alert('Credenciales incorrectas');
    }
} else {
    console.error('El valor de "users" no es un array válido.');
}
    
  }

  checkRememberedUser() {
    
    //const rememberedUser = JSON.parse(localStorage.getItem('rememberedUser'));
    const rememberedUser = JSON.parse(localStorage.getItem('rememberedUser') || '{}');
    if (rememberedUser) {
      this.username = rememberedUser.username;
      this.password = rememberedUser.password;
      this.rememberMe = true;
    }
  }

  async openRegisterModal() {
    const modal = await this.modalCtrl.create({
      component: RegisterPage
    });
    await modal.present();
  }
}