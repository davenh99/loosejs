import { signal, effect } from "../loose.js";

const Comp = () => {
  const [count, setCount] = signal(0);
  const element = document.createElement("button");

  element.classList.add("btn");
  element.innerHTML = `count: ${count()}`;

  element.addEventListener("click", () => {
    setCount(count() + 1);
  });

  return element;
};

const App = () => {
  const element = document.createElement("div");
  element.classList.add(..."p-5 h-screen".split(" "));
  element.appendChild(Comp());

  return element;
};

document.getElementById("root").appendChild(App());
