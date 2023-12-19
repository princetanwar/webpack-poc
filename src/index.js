import _ from "lodash";
import "./styles.css";
import Icon from "./icon.svg";
import Data from "./Data.json";

function component() {
  const element = document.createElement("div");

  // Lodash, now imported by this script
  element.innerHTML = _.join(["Hello", "webpack"], " ");

  // Add the image to our existing div.
  const myIcon = new Image();
  myIcon.src = Icon;

  element.appendChild(myIcon);

  console.log({ Data });

  return element;
}

document.body.appendChild(component());