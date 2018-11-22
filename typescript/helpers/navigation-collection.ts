import { INavigationCollection } from "../models";

export class NavigationCollection<T> implements INavigationCollection<T> {
  private items: { [index: string]: T } = {};
  
  private count: number = 0;
  
  public ContainsKey(key: string): boolean {
    return this.items.hasOwnProperty(key);
  }
  
  public Count(): number {
    return this.count;
  }
  
  public Add(key: string, value: T) {
    if (!this.items.hasOwnProperty(key)) this.count++;
    
    this.items[key] = value;
  }
  
  public Remove(key: string): T {
    var val = this.items[key];
    delete this.items[key];
    this.count--;
    return val;
  }
  
  public Item(key: string): T {
    return this.items[key];
  }
  
  public Keys(): string[] {
    var keySet: string[] = [];
    
    for (var prop in this.items) {
      if (this.items.hasOwnProperty(prop)) {
        keySet.push(prop);
      }
    }
    
    return keySet;
  }
  
  public Values(): T[] {
    var values: T[] = [];
    
    for (var prop in this.items) {
      if (this.items.hasOwnProperty(prop)) {
        values.push(this.items[prop]);
      }
    }
    
    return values;
  }
}

// import { NavigationItem } from './navigation-item';

// export class Navigation {
//   parent: string;
//   items: NavigationItem[];

//   constructor(parentName: string, items: NavigationItem[] = []) {
//     this.parent = parentName;
//     this.items = items;
//     console.log('Navigation created');
//   }

//   public setParent(parentName: string) {
//     this.parent = parentName;
//   }

//   public setItem(item: NavigationItem) {
//     this.items.push(item);
//   }
// }