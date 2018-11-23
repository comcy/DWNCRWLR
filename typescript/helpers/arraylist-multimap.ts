import { MultiMap, MultimapEntry } from "../models";

export class ArrayListMultimap<K, V> implements MultiMap<K, V> {

  private _entries: MultimapEntry<K, V>[] = []

  public clear(): void {
    this._entries = []
  }

  public containsKey(key: K): boolean {
    return this._entries
      .filter(entry => entry.key == key)
      .length > 0
  }

  public containsValue(value: V): boolean {
    return this._entries
      .filter(entry => entry.value == value)
      .length > 0
  }

  public containsEntry(key: K, value: V): boolean {
    return this._entries
      .filter(entry => entry.key == key && entry.value == value)
      .length > 0
  }

  public delete(key: K, value?: V): boolean {
    let temp = this._entries
    this._entries = this._entries
      .filter(entry => {
        if (value)
          return entry.key != key || entry.value != value
        return entry.key != key
      })
    return temp.length != this._entries.length
  }

  public get entries(): MultimapEntry<K, V>[] {
    return this._entries
  }

  public get(key: K): V[] {
    return this._entries
      .filter(entry => entry.key == key)
      .map(entry => entry.value)
  }

  public keys(): K[] {
    return Array.from(new Set(this._entries.map(entry => entry.key)))
  }

  public put(key: K, value: V): MultimapEntry<K, V>[] {
    this._entries.push(new MultimapEntry(key, value))
    return this._entries
  }
}


// import { INavigationCollection } from "../models";

// export class NavigationCollection<T> implements INavigationCollection<T> {
//   private items: { [index: string]: T } = {};
  
//   private count: number = 0;
  
//   public ContainsKey(key: string): boolean {
//     return this.items.hasOwnProperty(key);
//   }
  
//   public Count(): number {
//     return this.count;
//   }
  
//   public Add(key: string, value: T) {
//     if (!this.items.hasOwnProperty(key)) this.count++;
    
//     this.items[key] = value;
//   }
  
//   public Remove(key: string): T {
//     var val = this.items[key];
//     delete this.items[key];
//     this.count--;
//     return val;
//   }
  
//   public Item(key: string): T {
//     return this.items[key];
//   }
  
//   public Keys(): string[] {
//     var keySet: string[] = [];
    
//     for (var prop in this.items) {
//       if (this.items.hasOwnProperty(prop)) {
//         keySet.push(prop);
//       }
//     }
    
//     return keySet;
//   }
  
//   public Values(): T[] {
//     var values: T[] = [];
    
//     for (var prop in this.items) {
//       if (this.items.hasOwnProperty(prop)) {
//         values.push(this.items[prop]);
//       }
//     }
    
//     return values;
//   }
// }

// // import { NavigationItem } from './navigation-item';

// // export class Navigation {
// //   parent: string;
// //   items: NavigationItem[];

// //   constructor(parentName: string, items: NavigationItem[] = []) {
// //     this.parent = parentName;
// //     this.items = items;
// //     console.log('Navigation created');
// //   }

// //   public setParent(parentName: string) {
// //     this.parent = parentName;
// //   }

// //   public setItem(item: NavigationItem) {
// //     this.items.push(item);
// //   }
// // }