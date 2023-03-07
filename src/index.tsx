import type { Component } from 'solid-js';
import { Router, Routes, Route } from '@solidjs/router'
import { render } from 'solid-js/web';

import SearchPage from './SearchPage';
import EventPage from './EventPage';

const App: Component<{}> = () => {
	 return (
		<Router>
			<Routes>
      			<Route path='/' component={ SearchPage } />
				<Route path='/event1' component={ EventPage } />
			</Routes>
    	</Router>
	 )
};

render(() => <App />, document.getElementById('root') as HTMLElement);
