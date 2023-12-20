import "./styles.css";
import printFunction from "./print";

function getComponent() {
  const numbers1 = [1, 2, 3, 4, 5, 6];
  const numbers2 = [7, 8, 9, 10];
  const numbers3 = [...numbers1, ...numbers2];
  console.log({ numbers3 });

  return import("lodash")
    .then(({ default: _ }) => {
      const element = document.createElement("div");

      element.innerHTML = _.join(["Hello", "webpack"], " ");

      return element;
    })
    .catch((error) => "An error occurred while loading the component");
}

getComponent().then((component) => {
  document.body.appendChild(component);
  const myButton = document.createElement("button");
  myButton.innerHTML = "Click me";

  myButton.addEventListener("click", printFunction);
  document.body.appendChild(myButton);
});
