import type { Component } from 'solid-js';
import { Router, Routes, Route } from '@solidjs/router'
import SearchPage from './SearchPage';
import { render } from 'solid-js/web';

const App: Component<{}> = () => {
	 return (
		<Router>
			<Routes>
      			<Route path='/' component={ SearchPage } />
			</Routes>
    	</Router>
	 )
};

render(() => <App />, document.getElementById('root') as HTMLElement);
