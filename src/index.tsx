import { render } from 'solid-js/web';
import type { Component } from 'solid-js';

const App: Component<{}> = () => {
  return <div>Hello World</div>;
};

render(() => <App/>, document.getElementById('root') as HTMLElement);
