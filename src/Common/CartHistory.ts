import { Component } from "../Abstract/Component";
import { TDataHistory, TServices } from "../Abstract/Type";

export class CartHistory extends Component {
  constructor(parrent: HTMLElement, private services: TServices, private data: TDataHistory) {
    super(parrent, 'div', ['carthistory']);
    data.basket.forEach(goodBasket => {
      const divRow = new Component(this.root, 'div', ['carthustory__row']);
      new Component(divRow.root, 'img', ["carthistory__img"], null, ['src', 'alt'], [goodBasket.good.url, 'fdds'])
      new Component(divRow.root, 'span', ["cart__history__name"], goodBasket.good.name);
    })
    new Component(this.root, 'img', ["carthistory__done"], null, ['src', 'alt'], ['./assets/done.png', 'done'])
  }
}