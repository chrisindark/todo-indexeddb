
const prevOnLoadHandler = window.onload;
window.onload = function () {
  if (prevOnLoadHandler) {
    prevOnLoadHandler();
  }

  console.log('event onload');
};
