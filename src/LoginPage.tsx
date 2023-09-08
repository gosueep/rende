import { Component, createSignal } from 'solid-js'
import { useNavigate } from '@solidjs/router'



const LoginPage: Component<{}> = () => {
  const [name, setName] = createSignal('')
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [userID, setUserID] = createSignal('')
  const navigate = useNavigate()

  const handleSubmit = (e: Event) => {
    console.log('IS this working?')
    e.preventDefault()
  }

  return (
    <div class="flex justify-center items-center h-screen bg-gray-100">
      <form class="bg-white rounded-lg p-8 shadow-md">
        <h2 class="text-2xl font-medium mb-6">Welcome to Rende</h2>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="email">
            Name
          </label>
          <input
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="Name"
            type="Name"
            placeholder="Enter your Name"
            value={name()}
            onInput={(e) => setName(e.currentTarget.value)}
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="email">
            Email
          </label>
          <input
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Enter your email"
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
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
          />
        </div>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" onClick={handleSubmit}>
          Sign In
        </button>
      </form>
    </div>
  )
}

export default LoginPage
