import { getAuth } from "firebase/auth";
import { Component } from "../Abstract/Component";
import { TServices } from "../Abstract/Type";


export class Router {
  constructor(public links: Record<string, Component>, private services: TServices) {
    this.openPage();

    window.onhashchange = () => {
      this.openPage();
    }
  }

  openPage() {
    Object.values(this.links).forEach((el) => el.remove());

    const url = window.location.hash.slice(1);


    const user = this.services.authService.user;
    // if (url === 'account' && !user) {
    //   this.links['#authorization'].render();
    // } else {
    this.links['#' + url].render();
    // }
  }
}