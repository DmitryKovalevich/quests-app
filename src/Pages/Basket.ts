import { Component } from "../Abstract/Component";
import { TDataBasket, TGoodBasket, TServices } from "../Abstract/Type";
import { CardBasket } from "../Common/CardBasket";

export class Basket extends Component {
  noAuth: Component;
  yesAuth: Component;
  nullBasket: Component;
  fullBasket: Component;
  divBasket: Component;
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, 'div', ["basket"])
    let isPerson = false;
    const user = services.authService.user;
    if (user) isPerson = true;
    this.noAuth = new Component(this.root, 'div', ["basket__noauth"]);
    new Component(this.noAuth.root, 'span', ["basket__h1"], 'Sorry')
    new Component(this.noAuth.root, 'span', ["basket__h2"], 'to pre-order the quest you need to log in')
    const btnAuth = new Component(this.noAuth.root, 'input', ["basket__btn"], null, ['type', 'value'], ['button', 'Continue with Google']);
    btnAuth.root.onclick = () => {
      services.authService.authWidthGoogle();
    }
    this.yesAuth = new Component(this.root, 'div', []);
    this.isPersonBlock(isPerson);
    let isBasketClear = true;
    if (services.dbService.dataUser) {
      if (services.dbService.dataUser.basket.length > 0) isBasketClear = true;
    }
    this.nullBasket = new Component(this.yesAuth.root, 'div', []);
    new Component(this.nullBasket.root, 'span', ["basket__h1"], 'Basket is clear');
    this.fullBasket = new Component(this.yesAuth.root, 'div', ["fullbasket"]);
    services.dbService.calcDataBasket(user);
    this.toggleBasket(isBasketClear);
    this.divBasket = new Component(this.fullBasket.root, 'div', ["basket__books"]);
    if (services.dbService.dataUser) {
      services.dbService.dataUser.basket.forEach(el => {
        this.putGoodInBasket(this.divBasket, el);
      });
    }
    const divInfo = new Component(this.fullBasket.root, 'div', ['basket__information']);
    const percent = new Component(divInfo.root, 'span', ["basket__percent"], `Diskont: ${services.dbService.dataBasket.percent} $`);
    const total = new Component(divInfo.root, 'span', ["basket__percent"], `Total value: ${services.dbService.dataBasket.allSumma} $`);
    new Component(divInfo.root, 'span', [], 'On our website there is a discount system that ')
    new Component(divInfo.root, 'span', [], 'depends on the number of people')
    new Component(divInfo.root, 'span', [], '>5 persons discount is 5%')
    new Component(divInfo.root, 'span', [], '>8 persons discount is 10%')
    new Component(divInfo.root, 'span', ["basket__date"], 'Date: ')
    const btnOplata = new Component(divInfo.root, 'input', ["basket__btn"], null, ['type', 'value'], ['button', "Pre-Order"])
    btnOplata.root.onclick = () => {
      const user = services.authService.user;
      services.dbService.addBasketInHistory(user);
    }

    services.dbService.addListener('goodInBasket', (tovar) => {
      this.putGoodInBasket(this.divBasket, tovar as TGoodBasket);
      this.toggleBasket(true);
    });
    services.dbService.addListener('changeDataBasket', (dataBasket) => {//при изменении в корзине
      percent.root.innerHTML = `Diskont: ${(dataBasket as TDataBasket).percent} $`;
      total.root.innerHTML = `Total value: ${(dataBasket as TDataBasket).allSumma} $`;
      let isBasketClear = false;
      if (services.dbService.dataUser) {
        if (services.dbService.dataUser.basket.length > 0) isBasketClear = true;
      }
      this.toggleBasket(isBasketClear);
    });
    services.dbService.addListener("clearBasket", () => {//очистить корзину
      this.divBasket.root.innerHTML = '';
      this.toggleBasket(false);
    })
  }
  isPersonBlock(person: boolean) {
    if (person) {
      this.noAuth.remove();
      this.yesAuth.render()
    } else {
      this.noAuth.render();
      this.yesAuth.remove();
    }
  }
  toggleBasket(isBasketClear: boolean) {
    if (isBasketClear) {
      this.nullBasket.remove();
      this.fullBasket.render();
    } else {
      this.nullBasket.render();
      this.fullBasket.remove();
    }
  }
  putGoodInBasket(teg: Component, tovar: TGoodBasket) {
    new CardBasket(teg.root, this.services, tovar);
  }
}