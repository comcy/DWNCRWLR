import { MultimapEntry } from './multimap-entry';

export interface MultiMap<K, V> {
  clear(): void
  containsKey(key: K): boolean
  containsValue(value: V): boolean
  containsEntry(key: K, value: V): boolean
  delete(key: K, value?: V): boolean
  entries: MultimapEntry<K, V>[]
  get(key: K): V[]
  keys(): K[]
  put(key: K, value: V): MultimapEntry<K, V>[]
}
