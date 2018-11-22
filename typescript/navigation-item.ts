export class NavigationItem {

  name: string;
  link: string;
  displayName: string;

  constructor(name: string, link: string, displayName: string) {
    this.name = name;
    this.link = link;
    // if (displayName === '') displayName = 'no name'
    this.displayName = displayName === '' ? 'no name' : displayName;
  }

  public setName(name: string) {
    this.name = name;
  }

  public setLink(link: string) {
    this.link = link;
  }

  public setDisplayName(displayName: string) {
    this.displayName = displayName === '' ? 'no name' : displayName;
  }

}
