/**
 * the observer, when a signal is tracked, we write to the observer and add it to signal subscribers.
 * (then set it to null again, this is ok js is single threaded :))
 * it's a way to tie the effect to the signal, without having a global object/array full of effects
 * in order to not have an indefintely growing list of subscribers, we need to clean them up
 * @example
 *  Observer structure:
 *  {
 *    notify: () => void;
 *    cleanups: Set<() => void>;
 *  }
 */
let observer = null;

export function signal(val) {
  let _value = val;
  const _subscribers = new Set();

  function get() {
    // add the observer whenever we get the value
    if (observer !== null && !_subscribers.has(observer)) {
      // need to capture the observer
      const currentObserver = observer;
      // add a cleanup fn to the observer, so we can delete it once we are done.
      currentObserver.cleanup(() => _subscribers.delete(currentObserver));
      _subscribers.add(currentObserver);
    }
    return _value;
  }

  function set(valOrFn) {
    let newVal = valOrFn;
    if (typeof valOrFn === "function") {
      newVal = valOrFn(_value);
    }

    if (_value === newVal) return;

    _value = newVal;

    // make a copy so don't mutate set as we loop over it
    for (const sub of [..._subscribers]) {
      sub.notify();
    }
  }

  return [get, set];
}

export function effect(fn) {
  let _dispose = null;
  const _cleanups = new Set();
  // create an observer when we have an effect (I'm guessing will have to redo once we track multiple dependencies within one effect)
  const _observer = { notify: () => run(), cleanup: (cu) => _cleanups.add(cu) };

  function run() {
    dispose();
    // set the global observer before running the function
    observer = _observer;
    _dispose = fn();
    // move the nulling of the observer here now, we need to move it back so we can read back the cleanups
    observer = null;
  }

  function dispose() {
    // clear our _cleanups after cleaning them up :/ (they are set in the signal)
    for (const cleanup of _cleanups) {
      cleanup();
    }
    _cleanups.clear();

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
