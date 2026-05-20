export class Map2D<Key, Value> {
  value: Map<Key, Map<Key, Value>> = new Map();

  get = (i: Key, j: Key) => {
    let row = this.value.get(i);
    if (!row) {
      return undefined;
    }

    return row.get(j);
  };

  set = (i: Key, j: Key, value: Value) => {
    let row = this.value.get(i);
    if (!row) {
      row = new Map();
      this.value.set(i, row);
    }

    return row.set(j, value);
  };
}
