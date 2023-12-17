import { Component } from "../Abstract/Component";
import { TDataHistory, TServices } from "../Abstract/Type";
import { CartHistory } from "../Common/CartHistory";
import { Graph } from "../Common/Graph";

export class Account extends Component {
  noAuth: Component;
  adminAuth: Component;
  yesAuth: Component;
  divHistory: Component;
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, 'div', ["account"])
    this.noAuth = new Component(this.root, 'div', ['noauth']);
    new Component(this.noAuth.root, 'span', ['noauth__text'], 'Log in');
    const btnAuth = new Component(this.noAuth.root, 'input', ['noauth__auth'], null, ['type', 'value'], ['button', 'Continue with  Google'])
    btnAuth.root.onclick = () => {
      services.authService.authWidthGoogle()
      this.toggleUser();
    }
    this.yesAuth = new Component(this.root, 'div', ["yesauth"]);
    new Component(this.yesAuth.root, 'span', ["yesauth__title"], "Profile");
    const divInfo = new Component(this.yesAuth.root, 'div', ['yesauth__infa']);
    new Component(divInfo.root, 'img', ["yesauth__img"], null, ['src', 'alt'], ['./assets/person.png', 'person']);
    const divName = new Component(divInfo.root, 'div', ["yesauth__name"]);
    new Component(divName.root, 'p', [], `Name: ${services.authService.user?.displayName}`);
    new Component(divName.root, 'p', [], `E-mail: ${services.authService.user?.email}`);
    new Component(this.yesAuth.root, 'span', ["yesauth__orders"], 'Orders');
    this.divHistory = new Component(this.yesAuth.root, 'div', ["order__history"]);

    const user = services.authService.user;
    services.dbService.calcCountDocsHistory(user);

    services.dbService.getAllHistory(user).then((historys) => {
      this.putHistoryOnPage(this.divHistory, historys);
    });
    services.dbService.addListener('addInHistory', (history) => {
      const user = services.authService.user;
      this.putHistoryOnPage(this.divHistory, [history as TDataHistory]);
    });
    this.adminAuth = new Component(this.root, 'div', []);
    this.toggleUser();
    new Component(this.adminAuth.root, 'span', ["yesauth__title"], "Profile");
    const divInfo1 = new Component(this.adminAuth.root, 'div', ['yesauth__infa']);
    new Component(divInfo1.root, 'img', ["yesauth__img"], null, ['src', 'alt'], ['./assets/person.png', 'person']);
    const divName1 = new Component(divInfo1.root, 'div', ["yesauth__name"]);
    new Component(divName1.root, 'p', [], `Name: ${services.authService.user?.displayName}`);
    new Component(divName1.root, 'p', [], `E-mail: ${services.authService.user?.email}`);
    new Component(this.adminAuth.root, 'span', ['admin__title'], 'Statistics');
    const divGraph = new Component(this.adminAuth.root, "div", ["stat__graph"]);
    const graph = new Graph(divGraph.root);

    services.dbService.getAllHistory(user).then((historys) => {
      graph.graphik.data.datasets[0].data = services.dbService.updateDataGraph(historys);
      graph.graphik.update();
    });
    services.dbService.addListener('addInHistory', (history) => {
      const user = services.authService.user;
      services.dbService.getAllHistory(user).then((historys) => {
        graph.graphik.data.datasets[0].data = services.dbService.updateDataGraph(historys);
        graph.graphik.update();
      });
    });
  }
  toggleUser() {
    const user = this.services.authService.user;
    const admin = this.services.logicService.emailAdmin;
    if (user && user.email === admin) {
      this.noAuth.remove();
      this.yesAuth.remove();
      this.adminAuth.render();
    } else if (user && user.email != admin) {
      this.noAuth.remove();
      this.yesAuth.render();
      this.adminAuth.remove();
    } else {
      this.noAuth.render();
      this.yesAuth.remove();
      this.adminAuth.remove();
    }
  }
  putHistoryOnPage(teg: Component, historys: TDataHistory[]) {
    historys.forEach((history) => {
      new CartHistory(teg.root, this.services, history);
    })
  }
}