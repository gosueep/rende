import { Component, createSignal, useContext } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import toast, { Toaster } from 'solid-toast'


const LoginPage: Component<{}> = () => {
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const navigate = useNavigate()

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    const resp = await fetch(`/api/login`, {
      method: "POST",
      body: JSON.stringify({
        email: email(),
        password: password()
      })
    })

    const results = await resp.json()
    if (resp.status != 200) {
      toast.error(results)
      return
    }
    toast.success('Logged in :)')
    navigate("/")
  }

  return (
    <div class="flex justify-center items-center h-screen bg-gray-100">
      <Toaster position="top-center" />
      <form class="bg-white rounded-lg p-8 shadow-md w-1/5 min-w-fit">
        <h2 class="text-2xl font-medium mb-6">Welcome back!</h2>
        <div>
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
            Sign-in
          </button>
        </div>
        <p class="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <a href="/register" class="font-semibold leading-6 text-blue-500 hover:text-blue-700">
            Register here
          </a>
        </p>
      </form>
    </div>
  )
}

export default LoginPage
