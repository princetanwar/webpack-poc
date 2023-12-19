import _ from "lodash";
import "./styles.css";
import Icon from "./icon.svg";
// import Data from "./Data.json";
import printMe from "./print.js";

function component() {
  const element = document.createElement("div");
  
  // Lodash, now imported by this script
  element.innerHTML = _.join(["Hello", "webpack"], " ");
  
  // Add the image to our existing div.
  const btn = document.createElement("button");

  btn.innerHTML = "Click me and check the console!";
  btn.onclick = printMe;

  element.appendChild(btn);

  const myIcon = new Image();
  myIcon.src = Icon;

  element.appendChild(myIcon);

//   console.log({ Data });

  return element;
}

document.body.appendChild(component());
