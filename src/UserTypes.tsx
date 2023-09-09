

export type UserInfoType = {
    name: string,
	org_name: string,
	email: string,
	password: string
}

export type UserAuthType = {
    token: string,
    uid: string,
    email: string,
}


export const registerUser = async function (user:UserInfoType) {
    const resp = await fetch (`/api/register`)
    const results = await resp.json()
    const output = results as UserAuthType[]
    return output
}