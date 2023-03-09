import { Component } from "solid-js"

type Club = {
    id: string
    name: string
}

type ClubsListProps = {
    clubs: Club[]
}

const ClubsList = (props: ClubsListProps) => {
    return (
        <div class="flex flex-col">
            <div> Home </div>
            { (props.clubs).map(club => {return <div>{club.name}</div>}) }
        </div>
    )
}

const DashboardPage: Component<{}> = () => {
    const clubs: Club[] = [
        {id: '1', name: 'Club 1'},
        {id: '2', name: 'Club 2'},
        {id: '3', name: 'Club 3'},
    ]
    return (
        <>
            <ClubsList clubs={clubs} />
        </>
    )
}

export default DashboardPage