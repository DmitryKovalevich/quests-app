import { Component } from "../Abstract/Component";

export class Footer extends Component {
  constructor(parrent: HTMLElement) {
    super(parrent, 'footer', ["footer"])
    const divContacts = new Component(this.root, 'div', ['footer__contacts']);
    new Component(divContacts.root, 'span', ['footer__title'], 'Contacts');
    new Component(divContacts.root, 'span', [], 'E-mail: scrapy@gmail.com');
    new Component(divContacts.root, 'span', [], 'Phone: +234234253455466');
    const divMessenjer = new Component(divContacts.root, 'div', []);
    new Component(divMessenjer.root, 'a', ['footer__inst'], null, ['href'], ['#'])
    new Component(divMessenjer.root, 'a', ['footer__youtube'], null, ['href'], ['#'])


    new Component(this.root, 'div', ['footer__logo']);
    const divInfa = new Component(this.root, 'div', ['footer__infa']);
    new Component(divInfa.root, 'span', ['footer__title'], 'Information');
    new Component(divInfa.root, 'a', ['footer__href'], 'MAIN', ['href'], ['#'])
    new Component(divInfa.root, 'a', ['footer__href'], 'QUESTS', ['href'], ['#catalog'])
    new Component(divInfa.root, 'a', ['footer__href'], 'REVIEWS', ['href'], ['#reviews'])
    const divIcon = new Component(divContacts.root, 'div', []);
    new Component(divIcon.root, 'a', ['navigation__basket'], null, ['href'], ['#basket'])
    new Component(divIcon.root, 'a', ['navigation__account'], null, ['href'], ['#account'])
  }
}