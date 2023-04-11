import { Component, createSignal } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import bcrypt from 'bcrypt'



const RegisterPage: Component<{}> = () => {
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [betapass, setBetapass] = createSignal('')
  const [userID, setUserID] = createSignal('')
  const navigate = useNavigate()

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    const encoder = new TextEncoder()
    const data = encoder.encode(password())

    if (!['rendebeta', 'rendeopenbeta'].includes(betapass())) {
        alert('Incorrect Beta Key')
        return
    }

    if (password() == '' || email() == '') {
        alert('Email/Password cannot be blank!')
        return
    }

    crypto.subtle.digest('SHA-1', data)
      .then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
      })
      .then(hash => {
        return fetch('/api_register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email(),
            password_hash: hash
          })
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response.error !== '/api_register failed') {
          console.log('ID: ', response.id)
          setUserID(response.id)
          global.isLoggedIn = true
          global.userID = response.id
          navigate(`/dashboard`)
        } else {
          alert('Incorrect email or password. Please try again.')
        }
      })
      .catch(error => {
        console.log('Login error: ', error)
      })
  }

  return (
    <div class="flex justify-center items-center h-screen bg-gray-100">
      <form class="bg-white rounded-lg p-8 shadow-md">
        <h2 class="text-2xl font-medium mb-6">Welcome to Rende</h2>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="betapass">
            Beta Key
          </label>
          <input
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="betapass"
            type="betapass"
            placeholder="Enter the beta key"
            value={betapass()}
            onInput={(e) => setBetapass(e.currentTarget.value)}
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
          Create Account
        </button>
      </form>
    </div>
  )
}

export default RegisterPage
