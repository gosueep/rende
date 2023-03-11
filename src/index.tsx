import type { Component } from 'solid-js';
import { lazy } from "solid-js";
import { Router, Routes, Route } from '@solidjs/router'
import { render } from 'solid-js/web';

import DashboardPage from './DashboardPage';
// import SearchPage from './SearchPage';
// import EventPage from './EventPage';

const SearchPage = lazy(() => import("./SearchPage"))
const EventPage = lazy(() => import ("./EventPage"))

const App: Component<{}> = () => {
	 return (
		<Router>
			<Routes>
      			{/* <Route path='/' component={ SearchPage } /> */}
				{/* <Route path="/event/:id" component={ EventPage } /> */}
				<Route path='/' component={ DashboardPage } />
			</Routes>
    	</Router>
	 )
};

render(() => <App />, document.getElementById('root') as HTMLElement);
