export function signal(val) {
  let _value = val;

  function get() {
    return _value;
  }

  function set(valOrFn) {
    let newVal = valOrFn;
    if (typeof valOrFn === "function") {
      newVal = valOrFn(_value);
    }
    _value = newVal;
  }

  return [get, set];
}

export function effect(fn) {
  let _dispose = null;

  function run() {
    dispose();
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
