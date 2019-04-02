import {join} from 'lodash';
import './js/test';


document.addEventListener('DOMContentLoaded', function (e) {
  const element = document.createElement('h1');
  element.innerHTML = 'Hello World';
  document.body.appendChild(element)
});

function component() {
  let element = document.createElement('div');

  element.innerHTML = join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());

const prevOnLoadHandler = window.onload;
window.onload = function () {
  if (prevOnLoadHandler) {
    prevOnLoadHandler();
  }

  console.log('onload');
};
