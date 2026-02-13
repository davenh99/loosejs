export function signal(val) {
  let _value = val;

  function get() {
    return _value;
  }

  function set(newVal) {
    // not reactive yet
    console.log("set", newVal);
    _value = newVal;
  }

  return [get, set];
}

export function effect() {
  console.log("effect");
}

export function memo() {
  console.log("memo");
}

export function untrack() {
  console.log("untrack");
}
