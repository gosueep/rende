import { Link } from "@solidjs/router";

import SearchBar from "./SearchBar";


// Based off https://v1.tailwindcss.com/components/navigation
export default function NavBar() {
    return (
    <div class="sticky top-0 z-50 mb-5">
        <nav class="flex items-center justify-between bg-teal-500 px-6">
            <div class="flex items-center flex-shrink-0 text-white">
                {/* <svg class="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/></svg> */}
                {/* REPLACE WITH LOGO */}
                <Link href="/" class="font-semibold text-xl tracking-tight">
                    Rende
                </Link>
            </div>
            {/* <div class="block lg:hidden">
                <button class="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
                <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
                </button>
            </div> */}
            <div class="block items-center w-2/5 justify-center">
                {<SearchBar></SearchBar>}
            </div>
            <div>
                <Link href={global.isLoggedIn? `/dashboard`: '/userlogin'} class="text-sm px-4 py-2 leading-none text-white hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">
                    Post Event
                </Link>
                <Link href="/userlogin" class="text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">
                    Login
                </Link>
            </div>
        </nav>
    </div>
    );
}