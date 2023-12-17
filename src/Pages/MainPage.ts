import { Component } from "../Abstract/Component";
import { TServices } from "../Abstract/Type";

export class MainPage extends Component {
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, 'div', ["mainpage"]);
    new Component(this.root, 'p', ['mainpage__title'], 'Scary & Happy')
    new Component(this.root, 'p', ['mainpage__text'], 'We were created to provide innovative methods for completing  horror-quests and organizing them.With us you will be sure that every second of your time is worth it. ')
    const catalog = new Component(this.root, 'input', ['mainpage__btn'], null, ['type', 'value'], ['button', 'Choose quest'])
    catalog.root.onclick = () => {
      window.location.hash = '#catalog'
    }
  }
}