import Router from './router';


export default function App() {
  const appEl = document.getElementById('app');

  return {
    render(component) {
      // iterate through the children of the root node and delete them all
      while (appEl.firstChild) {
        appEl.removeChild(appEl.firstChild);
      }
      // then, add the new node as a child to the root node
      appEl.appendChild(component().node);
      // navigo's method to add handlers to dynamically generated anchor elements
      Router.updatePageLinks();
    }
  }
}
