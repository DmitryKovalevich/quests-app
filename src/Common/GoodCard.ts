import { Component } from "../Abstract/Component";
import { TGood, TServices } from "../Abstract/Type";

export class GoodCard extends Component {
  cardBtn: Component;
  constructor(parrent: HTMLElement, private services: TServices, private data: TGood) {
    super(parrent, 'div', ['goodcard']);
    // this.updateButtonState();
    new Component(this.root, 'img', ['goodcard__img'], null, ['src', 'alt'], [data.url, data.name]);
    const divCard = new Component(this.root, 'div', ['goodcard__info']);
    new Component(divCard.root, 'span', ['goodcard__name'], data.name);
    new Component(divCard.root, 'span', ['goodcard__difficulti'], `Difficulti: ${data.difficulti}`);
    new Component(divCard.root, 'span', ['goodcard__age'], `Age: ${data.age}+`)
    this.cardBtn = new Component(divCard.root, 'input', ['goodcard__btn'], null, ['type', 'value'], ['button', 'Pre-Order'])
    this.cardBtn.root.onclick = () => {
      this.addGoodInBasket();
      // (this.cardBtn.root as HTMLInputElement).classList.add('goodcard__btn__active');
      this.updateButtonState();
    }
    if (services.dbService.dataUser) {
      const index = services.dbService.dataUser.basket.findIndex((el) => el.good.id === data.id);
      if (index >= 0) {
        (this.cardBtn.root as HTMLInputElement).classList.add('goodcard__btn__active');
      }
    }
    services.dbService.addListener('delGoodFromBasket', (idBook) => {
      if (idBook === data.id) {
        (this.cardBtn.root as HTMLInputElement).classList.remove('goodcard__btn__active');
      }
    });
  }
  addGoodInBasket() {
    const user = this.services.authService.user;
    this.services.dbService.addGoodInBasket(user, this.data)
      .catch(() => {
        (this.cardBtn.root as HTMLInputElement).classList.remove('goodcard__btn__active');
      })
  }
  updateButtonState() {
    const basket = this.services.dbService.dataUser?.basket;
    if (basket) {
      const isActive = basket.some((el) => el.good.id === this.data.id);
      const buttonElement = this.cardBtn.root as HTMLInputElement;
      if (isActive) {
        buttonElement.classList.add('goodcard__btn__active');
      } else {
        buttonElement.classList.remove('goodcard__btn__active');
      }
    }
  }
}