
export default function SearchBar() {
	return (
		<div class="flex-none" id="searchbar-top">
			<div class="flex flex-row p-2">
				<div class="flex-1" id="searchbar">
					<div class="flex flex-row">
						<div class="flex-1">
							<input type="search" class="p-2.5 w-full align-top text-sm text-gray-900 bg-gray-300 border border-gray-300" placeholder="Search for events" required={true} />
						</div>
						<div class="flex-none"></div>
						<button type="submit" class="p-2.5 align-top text-sm font-medium text-white bg-blue-700 border border-blue-700">
							<svg aria-hidden="true" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
							</svg>
							<span class="sr-only">{"Search"}</span>
						</button>
					</div>
				</div>
				<div class="flex-none" id="categories">
					<button type="submit" class="p-2 align-top text-md font-medium text-white bg-yellow-600 border border-yellow-600">
						<span>Categories</span>
					</button>
				</div>
				<div class="flex-none" id="filter">
					<button type="submit" class="p-2 align-top text-md font-medium text-white bg-lime-700 border border-lime-700">
						<span>Filter</span>
					</button>
				</div>
				<div class="flex-none" id="sort">
					<button type="submit" class="p-2 align-top text-md font-medium text-white bg-teal-800 border border-teal-800">
						<span>Sort</span>
					</button>
				</div>
			</div>
		</div>
	);
}