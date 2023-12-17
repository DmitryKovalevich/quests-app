import { Component } from "../Abstract/Component";
import { TCriteria, TGood, TServices } from "../Abstract/Type";
import { GoodCard } from "../Common/GoodCard";

export class Catalog extends Component {
  criteria: TCriteria = {
    age: "all",
    difficulti: "up"
  }
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, 'div', ["catalog"]);
    const divButtons = new Component(this.root, 'div', ["catalog__buttons"]);
    new Component(divButtons.root, 'h1', ['page__title'], 'QUESTS');
    const btnSort = new Component(divButtons.root, 'input', ['catalog__sort'], null, ['type', 'value', 'data-difficulti'], ['button', '', 'up']);
    new Component(divButtons.root, 'input', ["catalog__button"], null, ['type', 'value', 'data-age'], ['button', '6+', '6'])
    new Component(divButtons.root, 'input', ["catalog__button"], null, ['type', 'value', 'data-age'], ['button', '12+', '12'])
    new Component(divButtons.root, 'input', ["catalog__button"], null, ['type', 'value', 'data-age'], ['button', '18+', '18'])
    Array.from(divButtons.root.children).forEach((el) => {
      if ((el as HTMLElement).dataset.age === this.criteria.age) {
        (el as HTMLElement).classList.add("active")
      } else {
        (el as HTMLElement).classList.remove("active")
      }
    })
    divButtons.root.onclick = (event) => {
      const param = (event.target as HTMLInputElement).dataset;
      if (!param.age) return;
      if (param.age) {
        this.criteria.age = param.age;
        Array.from(divButtons.root.children).forEach((el) => {
          if ((el as HTMLElement).dataset.age === this.criteria.age) {
            (el as HTMLElement).classList.add("active")
          } else {
            (el as HTMLElement).classList.remove("active")
          }
        })
      }

      services.dbService.getAllGood(this.criteria).then((goods) => {
        divGood.root.innerHTML = '';
        this.putGoodOnPage(divGood, goods);
      });
    }
    btnSort.root.onclick = (event) => {
      const param = (event.target as HTMLElement).dataset;
      if (!param.difficulti) return;
      if (param.difficulti) this.criteria.difficulti = param.difficulti;


      services.dbService.getAllGood(this.criteria).then((goods) => {
        divGood.root.innerHTML = '';
        this.putGoodOnPage(divGood, goods);
      });

      if (param.difficulti === 'up') {
        param.difficulti = 'down';
      } else {
        param.difficulti = 'up';
      }
    }
    const divGood = new Component(this.root, 'div', ["catalog__goods"]);
    services.dbService.getAllGood(this.criteria).then((goods) => {
      divGood.root.innerHTML = '';
      this.putGoodOnPage(divGood, goods);
    });
  }
  putGoodOnPage(teg: Component, goods: TGood[]) {
    goods.forEach((el) => {
      const goodCard = new GoodCard(teg.root, this.services, el);
      goodCard.cardBtn.root.addEventListener('click', () => {
        this.clearActiveButtons();
        goodCard.updateButtonState();
      });
    });
  }
  clearActiveButtons() {
    const buttons = this.root.querySelectorAll('.goodcard__btn');
    buttons.forEach((button) => {
      button.classList.remove('goodcard__btn__active');
    });
  }
}