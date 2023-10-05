import { Link } from "@solidjs/router";

import SearchBar from "./SearchBar";
import { Show } from "solid-js";

function loggedIn(): boolean {
    return document.cookie.split(";").some((item) => item.trim().startsWith("token"))
}

const logout = async (e: Event) => {
    const resp = await fetch (`/api/logout`, {
        method: "POST",
    })

    const results = await resp.json()
    if(resp.status != 200) {
      alert(results)
      return
    }

    location.reload()
}

// Based off https://v1.tailwindcss.com/components/navigation
export default function NavBar(props: any) {
    return (
        <div class="sticky top-0 z-50 mb-5">
            <nav class="sm:flex items-center justify-between bg-gray-800 px-6">
                <div class="flex items-center justify-center sm:items-stretch sm:justify-start text-white">
                    {/* <svg class="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/></svg> */}
                    {/* REPLACE WITH LOGO */}
                    <Link href="/" class="font-semibold text-xl tracking-tight hover:text-teal-500 hover:bg-gray-700">
                        theCalendar
                    </Link>
                </div>
                {/* Search Bar / Middle */}
                <div class="hidden sm:ml-6 sm:block items-center w-2/5 justify-center">
                    {<SearchBar onSearchChange={props.onSearchChange} onShowPastEventsClick={props.onShowPastEventsClick}></SearchBar>}
                </div>
                {/* Right side / Buttons */}
                <div class="hidden sm:ml-6 sm:block">
                    <div class="flex space-x-4">
                        <Link href='/dashboard' class="text-sm px-3 py-2 font-medium text-white hover:text-teal-500 hover:bg-gray-700 mt-4 lg:mt-0">
                            Post Event
                        </Link>
                        <Show when={!loggedIn()}>
                            <Link href="/register" class="text-sm px-3 py-2 font-medium border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-gray-700 mt-4 lg:mt-0">
                                Register
                            </Link>
                        </Show>
                        <Show
                            when={loggedIn()}
                            fallback={
                                <Link href="/login" class="text-sm px-3 py-2 font-medium border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-gray-700 mt-4 lg:mt-0">
                                    Login
                                </Link>
                        }>
                            <button onClick={logout} class="text-sm px-3 py-2 font-medium border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-gray-700 mt-4 lg:mt-0">
                                Sign out
                            </button>
                        </Show>
                    </div>
                </div>

                {/* <!-- Mobile menu, show/hide based on menu state. --> */}
                <div class="sm:hidden" id="mobile-menu">
                    <div class="space-y-1 px-2 pb-3 pt-2">
                        <Link href="/register" class="text-white hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">
                            Register
                        </Link>
                        <Link href="/login" class="text-white hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">
                            Login
                        </Link>
                    </div>
                </div>
            </nav>
        </div>
    );
}