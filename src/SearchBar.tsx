
export default function SearchBar(props: any) {
	return (
		<div class="flex-none" id="searchbar-top">
			<div class="flex flex-row p-2">
				<div class="flex-1" id="searchbar">
					<div class="flex flex-row">
						<div class="flex-1">
							<input 
								type="search" 
								class="p-2.5 w-full align-top text-sm text-gray-900 bg-gray-300 border border-gray-300 rounded" 
								placeholder="Search for events" 
								required={true}
								onInput={props.onSearchChange}
							/>
						</div>
						<div class="flex-none"></div>
						<button type="submit" class="p-2.5 align-top text-sm font-medium text-white bg-blue-700 border border-blue-700 rounded">
							<svg aria-hidden="true" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
							</svg>
							<span class="sr-only">{"Search"}</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}