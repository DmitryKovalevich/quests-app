import { compareAsc } from "date-fns";
import { th } from "date-fns/locale";
import { Component } from "../Abstract/Component";
import { TServices } from "../Abstract/Type";

export class Reviews extends Component {
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, 'div', ["reviews"]);
    new Component(this.root, 'span', ['page__title'], 'REVIEWES');
    const divRow = new Component(this.root, 'div', ['reviews__row']);
    new Component(divRow.root, 'img', [], null, ['src', 'alt'], ['./assets/back.png', 'gfd']);
    new Component(divRow.root, 'img', ["review__img"], null, ['src', 'alt'], ['./assets/review.png', 'gfd']);
    new Component(divRow.root, 'img', [], null, ['src', 'alt'], ['./assets/next.png', 'gfd']);
    new Component(this.root, 'input', ["review__btn"], null, ['type', 'value'], ['button', 'Add review'])
  }
}