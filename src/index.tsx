import type { Component } from 'solid-js';
import { createContext, createSignal, lazy, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { Router, Routes, Route } from '@solidjs/router'
import { render } from 'solid-js/web';
import { UserAuthType } from './user/UserTypes';

const SearchPage = lazy(() => import("./HomePage"))
const EventPage = lazy(() => import("./event/EventPage"))
const DashboardPage = lazy(() => import("./user/DashboardPage"))
const LoginPage = lazy(() => import("./user/LoginPage"))
const RegisterPage = lazy(() => import("./user/RegisterPage"))
const FirstLogin = lazy(() => import("./user/FirstLogin"))

// declare global {
// 	var isLoggedIn: boolean
// 	var userID: number
// }

// global.isLoggedIn = false

// Have context store token - expiration??
// store uid

export const UserContext = createContext<UserAuthType>();
// export const UserTokenCtx = createContext();


const App: Component<{}> = () => {
	// const AuthCtx = createContext();
	return (
		<Router>
			<Routes>
				<Route path='/' component={SearchPage} />
				<Route path='/event/:id' component={EventPage} />

				<Route path='/login' component={LoginPage} />
				<Route path='/register' component={RegisterPage} />
				<Route path='/first_login' component={FirstLogin} />

				<Route path='/dashboard' component={DashboardPage} />
			</Routes>
		</Router>
	)
};

render(() => <App />, document.getElementById('root') as HTMLElement);
