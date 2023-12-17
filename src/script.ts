import './style.scss';
import { Component } from './Abstract/Component';
import { Router } from './Common/Router';
import { Header } from './Common/Header';
import { Footer } from './Common/Footer';
import { MainPage } from './Pages/MainPage';
import { Catalog } from './Pages/Catalog';
import { Account } from './Pages/Account';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../configFB';
import { AuthService } from './Services/AuthService';
import { LogicService } from './Services/LogicService';
import { getFirestore } from 'firebase/firestore';
import { DBService } from './Services/DBService';
import { Basket } from './Pages/Basket';
import { Reviews } from './Pages/Reviews';

const body = document.body;

const DBFirestore = initializeApp(firebaseConfig);
const db = getFirestore(DBFirestore);

const services = {
  authService: new AuthService(),
  logicService: new LogicService(),
  dbService: new DBService(DBFirestore)
};

class App {
  constructor(parrent: HTMLElement) {
    const wrap = new Component(parrent, 'div', ["wrapper"]);
    new Header(wrap.root, services);
    const main = new Component(wrap.root, "main");

    const links = {
      "#": new MainPage(main.root, services),
      "#catalog": new Catalog(main.root, services),
      "#account": new Account(main.root, services),
      "#basket": new Basket(main.root, services),
      "#reviews": new Reviews(main.root, services),
    };

    new Router(links, services);
    new Footer(wrap.root);

  }
}
declare global {
  interface Window {
    app: App;
  }
}

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  services.authService.user = user;
  services.dbService
    .getDataUser(user)
    .then(() => {
      if (!window.app) window.app = new App(document.body);
    })
    .catch((error) => {
      console.log(error);
    });
})

