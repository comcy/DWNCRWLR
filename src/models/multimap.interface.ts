import { MultimapEntry } from './multimap-entry';

export interface IMultiMap<K, V> {
  entries: Array<MultimapEntry<K, V>>;
  clear(): void;
  containsKey(key: K): boolean;
  containsValue(value: V): boolean;
  containsEntry(key: K, value: V): boolean;
  delete(key: K, value?: V): boolean;
  get(key: K): V[];
  keys(): K[];
  put(key: K, value: V): Array<MultimapEntry<K, V>>;
}
