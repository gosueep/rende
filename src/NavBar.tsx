import { Link } from "@solidjs/router";

import SearchBar from "./SearchBar";


// Based off https://v1.tailwindcss.com/components/navigation
export default function NavBar(props: any) {
    return (
    <div class="sticky top-0 z-50 mb-5">
        <nav class="sm:flex items-center justify-between bg-gray-800 px-6">

            {/* https://tailwindui.com/components/application-ui/navigation/navbars */}
            {/* BUTTON FOR MOBILE */}
            {/* <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <button type="button" class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                    <span class="sr-only">Open main menu</span>
                    <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path></svg>
                    <svg class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div> */}
            {/* Name & Logo */}
            <div class="flex items-center justify-center sm:items-stretch sm:justify-start text-white">
                {/* <svg class="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/></svg> */}
                {/* REPLACE WITH LOGO */}
                <Link href="/" class="font-semibold text-xl tracking-tight hover:text-teal-500 hover:bg-gray-700">
                    Rende
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
                    <Link href="/register" class="text-sm px-3 py-2 font-medium border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-gray-700 mt-4 lg:mt-0">
                        Register
                    </Link>
                    <Link href="/login" class="text-sm px-3 py-2 font-medium border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-gray-700 mt-4 lg:mt-0">
                        Login
                    </Link>
                </div>
            </div>

            {/* <!-- Mobile menu, show/hide based on menu state. --> */}
            <div class="sm:hidden" id="mobile-menu">
                <div class="space-y-1 px-2 pb-3 pt-2">
                    <Link href='/dashboard' class="text-white hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">
                        Post Event
                    </Link>
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