import { Component, createSignal } from 'solid-js'
import { useNavigate } from '@solidjs/router'


const RegisterPage: Component<{}> = () => {
  const [name, setName] = createSignal('')
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [org, setOrg] = createSignal('')
  const [userID, setUserID] = createSignal('')
  const navigate = useNavigate()

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    const resp = await fetch (`http://localhost:8000/api/register`, {
      method: "POST",
      body: JSON.stringify({
        email: email(),
        password: password(),
        name: name(),
        org: org(),
      })
    })

    const results = await resp.json()
    console.log(resp)
    console.log(results)
    if(resp.status != 200) {
      alert(results)
      return
    }

    sessionStorage.clear()
    navigate("/login")

    // .then(out => console.log(out))
    console.log()
    // return output
  }

  return (
    <div class="flex justify-center items-center h-screen bg-gray-100">
      <form class="bg-white rounded-lg p-8 shadow-md w-1/5 min-w-fit">
        <h2 class="text-2xl font-medium mb-6">Welcome to Rende</h2>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="email">
            Name
          </label>
          <input
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name" type="text" placeholder="Enter your name"
            required
            value={name()}
            onInput={(e) => setName(e.currentTarget.value)}
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="email">
            Organization
          </label>
          <input
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="org" type="text" placeholder="Enter your organization"
            required
            value={org()}
            onInput={(e) => setOrg(e.currentTarget.value)}
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="email">
            Email
          </label>
          <input
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email" type="email" placeholder="Enter your email"
            autocomplete='email' required
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 font-bold mb-2" for="password">
            Password
          </label>
          <input
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password" type="password" placeholder="Enter your password"
            autocomplete='password' required
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
          />
        </div>
        <div class='flex flex-col items-center'>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
            type="submit" onClick={handleSubmit}>
            Create Account
          </button>
        </div>
        <p class="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/login" class="font-semibold leading-6 text-blue-500 hover:text-blue-700">
            Sign-in here
          </a>
        </p>
      </form>
    </div>
  )
}

export default RegisterPage
