import type { Component } from 'solid-js';
import { lazy } from "solid-js";
import { Router, Routes, Route } from '@solidjs/router'
import { render } from 'solid-js/web';

const SearchPage = lazy(() => import("./SearchPage"))
const EventPage = lazy(() => import ("./EventPage"))
const DashboardPage  = lazy(() => import("./DashboardPage"))
const LoginPage = lazy(() => import("./LoginPage"))

declare global {
	var isLoggedIn: boolean
	var userID: number
}

global.isLoggedIn = false

// CONVERTED TO LAZY LOADING, pages only rendered when clicked as opposed to upon startup
// 	Might not matter at all, so feel free to revert.
// import SearchPage from './SearchPage'
// import EventPage from './EventPage'
// import DashboardPage from './DashboardPage'
// import LoginPage from './LoginPage'

const App: Component<{}> = () => {
	return (
	<Router>
		<Routes>
			<Route path='/' component={ SearchPage } />
			{/* <Route path='/' component={ EventPage } /> */}
			<Route path='/userlogin' component={ LoginPage } />
			<Route path='/dashboard' component={ DashboardPage } />
		</Routes>
	</Router>
	)
};

render(() => <App />, document.getElementById('root') as HTMLElement);
