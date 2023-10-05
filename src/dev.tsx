import { Link } from "@solidjs/router";

export default function dev() {

    return <>
        <div>
            <Link href="/">Home</Link>
            <br />
            <Link href="/event">Event Test</Link>
            <br></br>
            <Link href="/">Home</Link>
            <br></br>
        </div>
    </>
}