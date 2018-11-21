export class NavigationItem {

  name: string;
  link: string;

  constructor(name: string, link: string) {
    this.name = name;
    this.link = link;
  }

  public setName(name: string) {
    this.name = name;
  }

  public setLink(link: string) {
    this.link = link;
  }

}
