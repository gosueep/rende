import type { Component } from 'solid-js';
import { lazy } from "solid-js";
import { Router, Routes, Route } from '@solidjs/router'
import { render } from 'solid-js/web';

const SearchPage = lazy(() => import("./SearchPage"))
const EventPage = lazy(() => import ("./EventPage"))
// import SearchPage from './SearchPage'
// import EventPage from './EventPage'
import DashboardPage from './DashboardPage'
import LoginPage from './LoginPage'

const App: Component<{}> = () => {
	 return (
		<Router>
			<Routes>
				{/* <Route path="/event/:id" component={ EventPage } /> */}
				<Route path='/' component={ LoginPage } />
      			<Route path='/SearchPage' component={ SearchPage } />
				<Route path='/' component={ DashboardPage } />
			</Routes>
    	</Router>
	 )
};

render(() => <App />, document.getElementById('root') as HTMLElement);
