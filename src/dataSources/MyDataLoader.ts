import DataLoader from "dataloader";
import objectHash from "object-hash";

// Util types
type DataLoaderResult<T> = T | Error;
export type DataLoaderReturnType<T> = Promise<DataLoaderResult<T>[]>;

// DataLoader API changes
type CType = ReturnType<typeof objectHash>;
type MyDataLoaderOptions<K, V> = Omit<
  DataLoader.Options<K, V, CType>,
  "cacheKeyFn"
>;

// Implementation types
type KeyExtractorFn<K, V> = (obj: V) => K;
/** Filter object properties by value type */
type ExtractWithValueType<T, ValueType> = {
  [k in keyof T as T[k] extends ValueType ? k : never]: T[k];
};
/** Either a function (v: Value)=>Key OR a property name */
type KeyExtractor<K, V> =
  | KeyExtractorFn<K, V>
  | keyof ExtractWithValueType<V, K>;

function collectSettledPromises<T>(
  results: PromiseSettledResult<T>[]
): DataLoaderResult<T>[];
function collectSettledPromises<T, E>(
  results: PromiseSettledResult<T>[],
  mapperFn: (e: T) => E
): DataLoaderResult<E>[];
function collectSettledPromises<T, E>(
  results: PromiseSettledResult<T>[],
  mapperFn?: (e: T) => E
): DataLoaderResult<T | E>[] {
  return results.map((e) => {
    if (e.status === "rejected") {
      return e.reason;
    }
    const mapper = mapperFn || ((a: T): E => a as any);
    return mapper(e.value);
  });
}

/**
 * Custom dataLoader class. Has some utils, but mainly cause it handles objects as keys.
 * this is done by hashing the keys to string.
 */
export default class MyDataLoader<K, V> extends DataLoader<K, V, CType> {
  constructor(
    batchLoadFn: DataLoader.BatchLoadFn<K, V>,
    options?: MyDataLoaderOptions<K, V>
  ) {
    super(batchLoadFn, {
      ...options,
      cacheKeyFn: (key: K) => objectHash(key),
    });
  }

  addToCache = (keyExtractor: KeyExtractor<K, V>, ...items: V[]): void => {
    const defaultKeyExtractor = (e: V) => (e as any)[keyExtractor];
    const keyExtractFn: KeyExtractorFn<K, V> =
      typeof keyExtractor === "function" ? keyExtractor : defaultKeyExtractor;
    items.forEach((item) => this.prime(keyExtractFn(item), item));
  };

  static collectSettledPromises = collectSettledPromises;
}
