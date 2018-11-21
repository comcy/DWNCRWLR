import { NavigationItem } from "./navigation-item";

export class Navigation {

    parent: string;
    items: NavigationItem[];

    constructor(parentName: string, items: NavigationItem[] = []) {
        this.parent = parentName;
        this.items = items;
    }

    public setParent(parentName: string) {
        this.parent = parentName;
    }

    public setItem(item: NavigationItem) {
        this.items.push(item);
    }

}
