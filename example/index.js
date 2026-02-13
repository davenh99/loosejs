import { signal, effect } from "../loose.js";

const App = () => {
  const [val, setVal] = signal(0);

  const element = document.createElement("div");
  element.className = "p-5 h-screen";

  const btn = document.createElement("button");
  btn.className = "btn btn-square btn-success";
  btn.onclick = () => setVal((prev) => prev + 1);
  btn.textContent = "+";

  const displayValue = document.createElement("p");
  displayValue.className = "input w-9 ml-1";
  displayValue.textContent = String(val());

  element.appendChild(btn);
  element.appendChild(displayValue);

  effect(() => {
    // reactive context, will set textContent whenever we call setVal (the button does that)
    displayValue.textContent = String(val());
  });

  return element;
};

document.getElementById("root").appendChild(App());
