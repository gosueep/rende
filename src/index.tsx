import type { Component } from 'solid-js';
import { createContext, createSignal, lazy, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { Router, Routes, Route } from '@solidjs/router'
import { render } from 'solid-js/web';
import { UserAuthType } from './UserTypes';

const SearchPage = lazy(() => import("./HomePage"))
const EventPage = lazy(() => import("./EventPage"))
const DashboardPage = lazy(() => import("./DashboardPage"))
const LoginPage = lazy(() => import("./LoginPage"))
const RegisterPage = lazy(() => import("./RegisterPage"))

declare global {
	var isLoggedIn: boolean
	var userID: number
}

global.isLoggedIn = false

export const UserContext = createContext<UserAuthType>();
export const UserTokenCtx = createContext();

export function TokenProvider(props:any) {
	const [token, setToken] = createSignal(""),
    tok = [
      token,
      {
        setToken
      }
    ];

  return (
    <UserTokenCtx.Provider value={tok}>
      {props.children}
    </UserTokenCtx.Provider>
  );
}

const App: Component<{}> = () => {
	
	// const [user, setUser] = createSignal<UserAuthType>(),
	// userCtx = [
	// 	user,
	// 	{setToken() {
	// 		setUser({
	// 			token: user.token,
	// 			uid: user.uid,
	// 			email: user.email,
	// 		})
	// 	}}
	// ]

	// onMount(async () => {
	// 	createContext()
	// });
	const [token, setToken] = createStore();
	const AuthCtx = createContext();
	return (
		<AuthCtx.Provider value={token}>
			<Router>
				<Routes>
					<Route path='/' component={SearchPage} />
					<Route path='/event/:id' component={EventPage} />
					<Route path='/login' component={LoginPage} />
					<Route path='/register' component={RegisterPage} />
					<Route path='/dashboard' component={DashboardPage} />
				</Routes>
			</Router>
		</AuthCtx.Provider>
	)
};

render(() => <App />, document.getElementById('root') as HTMLElement);
