export class NavigationItem {
  private name: string;
  private link: string;
  private displayName: string;

  constructor(name: string, link: string, displayName: string = 'no name') {
    this.name = name;
    this.link = link;
    if (displayName === 'no name') {
      this.displayName = name;
    } else {
      this.displayName = displayName;
    }
  }

  public setName(name: string) {
    this.name = name;
  }

  public setLink(link: string) {
    this.link = link;
  }

  public setDisplayName(displayName: string) {
    this.displayName = displayName;
  }
}
