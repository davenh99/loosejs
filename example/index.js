import { signal, effect } from "../loose.js";

const App = () => {
  // const [val, setVal] = signal(0);

  const element = document.createElement("div");
  element.className = "p-5 h-screen";

  // const btn = document.createElement("button");
  // btn.className = "btn btn-square btn-error";
  // btn.onclick = () => setVal((prev) => prev - 1);
  // btn.textContent = "-";

  // const displayValue = document.createElement("p");
  // displayValue.className = "input w-10 mx-1 text-center";
  // displayValue.textContent = String(val());

  // const btn2 = document.createElement("button");
  // btn2.className = "btn btn-square btn-success";
  // btn2.onclick = () => setVal((prev) => prev + 1);
  // btn2.textContent = "+";

  // element.appendChild(btn);
  // element.appendChild(displayValue);
  // element.appendChild(btn2);

  // effect(() => {
  //   // reactive context, will set textContent whenever we call setVal (the button does that)
  //   displayValue.textContent = String(val());
  // });

  const [val2, setVal2] = signal(0);

  const dispose = effect(() => {
    console.log(val2());
  });

  setVal2(1);
  setVal2(10);
  setVal2((prev) => prev + 1);
  dispose();
  setVal2(5); // we shouldn't see this
  setVal2(6); // we shouldn't see this

  return element;
};

document.getElementById("root").appendChild(App());
