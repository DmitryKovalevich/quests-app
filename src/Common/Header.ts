import { Component } from "../Abstract/Component";
import { TServices } from "../Abstract/Type";

export class Header extends Component {
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, 'header', ["header"]);
    new Component(this.root, 'a', ["header__logo"], "Quests", ['href'], ['#'])
    const divNav = new Component(this.root, 'div', ['header__navigation']);
    new Component(divNav.root, 'a', ['navigation'], 'MAIN', ['href'], ['#'])
    new Component(divNav.root, 'a', ['navigation'], 'QUESTS', ['href'], ['#catalog'])
    new Component(divNav.root, 'a', ['navigation'], 'REVIEWS', ['href'], ['#reviews'])
    new Component(divNav.root, 'a', ['navigation__basket'], null, ['href'], ['#basket'])
    new Component(divNav.root, 'a', ['navigation__account'], null, ['href'], ['#account'])
  }
}