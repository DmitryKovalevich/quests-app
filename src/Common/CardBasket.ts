import { Component } from "../Abstract/Component";
import { TGoodBasket, TServices } from "../Abstract/Type";

export class CardBasket extends Component {
  spanCount: Component;
  constructor(parrent: HTMLElement, private services: TServices, private data: TGoodBasket) {
    super(parrent, 'div', ['cardbasket']);
    new Component(this.root, 'span', ["cardbasket__name"], data.good.name);
    const divCount = new Component(this.root, 'div', ["cardbasket__count"]);
    const btnDec = new Component(divCount.root, 'input', [], null, ['type', 'value'], ['button', '-']);
    btnDec.root.onclick = () => {
      this.changeCountBook(-1);
    }
    this.spanCount = new Component(divCount.root, 'span', [], `${data.count}`)
    const btnInk = new Component(divCount.root, 'input', [], null, ['type', 'value'], ['button', '+']);
    btnInk.root.onclick = () => {
      this.changeCountBook(1);
    }

    new Component(this.root, 'span', [], `Price per person is ${data.good.price}$`)
  }
  changeCountBook(grad: number) {
    const newCount = this.data.count + grad;
    if (newCount <= 0) return;

    const newData = {} as TGoodBasket;
    Object.assign(newData, this.data);
    newData.count = newCount;

    const user = this.services.authService.user;
    this.services.dbService.changeGoodInBasket(user, newData).then(() => {
      Object.assign(this.data, newData);
      this.spanCount.root.innerHTML = `${this.data.count}`;
    });
  }
}