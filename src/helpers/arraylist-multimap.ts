import { IMultiMap, MultimapEntry } from '../models/index';

export class ArrayListMultimap<K, V> implements IMultiMap<K, V> {

  private entriesList: Array<MultimapEntry<K, V>> = [];

  public clear(): void {
    this.entriesList = [];
  }

  public containsKey(key: K): boolean {
    return this.entriesList
      .filter(entry => entry.key === key)
      .length > 0;
  }

  public containsValue(value: V): boolean {
    return this.entriesList
      .filter(entry => entry.value === value)
      .length > 0;
  }

  public containsEntry(key: K, value: V): boolean {
    return this.entriesList
      .filter(entry => entry.key === key && entry.value === value)
      .length > 0;
  }

  public valueCount(key: K): number {
    return this.entriesList
      .filter(entry => entry.key === key)
      .length;
  }

  public delete(key: K, value?: V): boolean {
    const temp = this.entriesList;
    this.entriesList = this.entriesList
      .filter(entry => {
        if (value) {
          return entry.key !== key || entry.value !== value;
        }
        return entry.key !== key;
      });
    return temp.length !== this.entriesList.length;
  }

  public get entries(): Array<MultimapEntry<K, V>> {
    return this.entriesList;
  }

  public get(key: K): V[] {
    return this.entriesList
      .filter(entry => entry.key === key)
      .map(entry => entry.value);
  }

  public keys(): K[] {
    return Array.from(new Set(this.entriesList.map(entry => entry.key)));
  }

  public put(key: K, value: V): Array<MultimapEntry<K, V>> {
    this.entriesList.push(new MultimapEntry(key, value));
    return this.entriesList;
  }
}
