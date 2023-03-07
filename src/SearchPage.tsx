import { Link } from "@solidjs/router"
import { Component } from "solid-js"

const SearchPage: Component<{}> = () => {
    return <div class="flex flex-row">
		<div class="flex-none" id="dashboard-left">
			Dashboard
		</div>
		<div class="flex-1" id="content">
			<div class="flex flex-col">
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
				<div class="flex-1" id="grid-events">
					<div class="grid grid-flow-row-dense grid-cols-5">
						<div>
							<Link href="/event1">EVENT 1</Link>
						</div>
						<div>2</div>
						<div>3</div>
						<div>4</div>
						<div>5</div>
						<div>6</div>
						<div>7</div>
						<div>8</div>
						<div>9</div>
						<div>10</div>
						<div>11</div>
						<div>12</div>
						<div>13</div>
						<div>14</div>
						<div>15</div>
						<div>16</div>
						<div>17</div>
						<div>18</div>
						<div>19</div>
						<div>20</div>
						<div>21</div>
					</div>
				</div>
			</div>
		</div>
	</div>
} 

export default SearchPage