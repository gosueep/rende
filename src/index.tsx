import type { Component } from 'solid-js';
import { Router, Routes, Route } from '@solidjs/router'
import { render } from 'solid-js/web';

import SearchPage from './SearchPage';
import EventPage from './EventPage';
import DashboardPage from './DashboardPage';

const App: Component<{}> = () => {
	 return (
		<Router>
			<Routes>
      			<Route path='/' component={ SearchPage } />
				<Route path='/event1' component={ EventPage } />
				<Route path='/dashboard' component={ DashboardPage } />
			</Routes>
    	</Router>
	 )
};

render(() => <App />, document.getElementById('root') as HTMLElement);
