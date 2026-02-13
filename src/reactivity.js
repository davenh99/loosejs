/**
 * the observer, when a signal is tracked, we write to the observer and add it to signal subscribers.
 * (then set it to null again, this is ok js is single threaded :))
 * it's a way to tie the effect to the signal, without having a global object/array full of effects
 * @example
 * // Observer structure:
 * // { notify: () => void }
 */
let observer = null;

export function signal(val) {
  let _value = val;
  let _subscribers = new Set();

  function get() {
    // add the observer whenever we get the value
    if (observer !== null && !_subscribers.has(observer)) {
      _subscribers.add(observer);
    }
    observer = null;
    return _value;
  }

  function set(valOrFn) {
    let newVal = valOrFn;
    if (typeof valOrFn === "function") {
      newVal = valOrFn(_value);
    }

    _value = newVal;

    for (const sub of _subscribers) {
      sub.notify();
    }
  }

  return [get, set];
}

export function effect(fn) {
  let _dispose = null;
  // create an observer when we have an effect (I'm guessing will have to redo once we track multiple dependencies within one effect)
  let _observer = { notify: () => run() };

  function run() {
    dispose();
    // set the global observer before running the function
    observer = _observer;
    _dispose = fn();
  }

  function dispose() {
    if (typeof _dispose === "function") {
      _dispose();
    }
  }

  run();

  return dispose;
}

// h(), utility to make reactive elements (reactivity not included yet)
export function h(tag, props, ...children) {
  const el = document.createElement(tag);

  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (key.startsWith("on") && typeof value === "function") {
        // event handlers
        const eventName = key.substring(2).toLowerCase();
        el.addEventListener(eventName, value);
      } else if (key === "class" || key === "className") {
        // class
        el.className = value;
      } else if (key === "style" && typeof value === "object") {
        // style props
        Object.assign(el.style, value);
      } else if (key in el) {
        // DOM properties
        el[key] = value;
      } else {
        // attributes
        el.setAttribute(key, value);
      }
    }
  }

  for (const child of children) {
    if (child == null || child === false || child === undefined) {
      continue;
    } else if (typeof child === "string" || typeof child === "number") {
      el.append(String(child));
    } else if (child instanceof Node) {
      el.appendChild(child);
    } else if (Array.isArray(child)) {
      child.forEach((c) => el.appendChild(c));
    }
  }

  return el;
}
