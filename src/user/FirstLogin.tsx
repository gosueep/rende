import { Component, createSignal } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import toast, { Toaster } from 'solid-toast';


const FirstLogin: Component<{}> = () => {
  const [firstName, setFirstName] = createSignal('')
  const [lastName, setLastName] = createSignal('')
  const [org, setOrg] = createSignal('')
  const navigate = useNavigate()

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    const resp = await fetch (`/api/update_user`, {
      method: "POST",
      body: JSON.stringify({
        first_name: firstName(),
        last_name: lastName(),
        org: org(),
      })
    })

    const results = await resp.json()
    if(resp.status != 200) {
      alert(results)
      return
    }

    navigate("/")
  }

  return (
    <div class="flex justify-center items-center h-screen bg-gray-100">
      <form class="bg-white rounded-lg p-8 shadow-md w-1/5 min-w-fit">
        <h2 class="text-2xl font-medium mb-6">Tell us about yourself</h2>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="email">
            First Name
          </label>
          <input
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name" type="text" placeholder="First"
            required
            value={firstName()}
            onInput={(e) => setFirstName(e.currentTarget.value)}
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="email">
            Last Name
          </label>
          <input
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name" type="text" placeholder="Last"
            required
            value={lastName()}
            onInput={(e) => setLastName(e.currentTarget.value)}
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="email">
            Organization
          </label>
          <input
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="org" type="text" placeholder="Enter your organization"
            value={org()}
            onInput={(e) => setOrg(e.currentTarget.value)}
          />
        </div>
        <div class='flex flex-col items-center'>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
            type="submit" onClick={handleSubmit}>
            Next
          </button>
        </div>
      </form>
    </div>
  )
}

export default FirstLogin
