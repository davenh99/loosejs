import { signal, effect } from "../loose.js";

const App = () => {
  const element = document.createElement("div");
  element.className = "p-5 h-screen";

  // no stuff yet, we will just test tracking of signals properly.
  const [val, setVal] = signal(0);

  // initially, 0 should be logged
  effect(() => {
    console.log(val());
  });

  // all of these should be logged
  setVal(1);
  setVal((prev) => prev + 1); // increment
  setVal(10);

  return element;
};

document.getElementById("root").appendChild(App());
