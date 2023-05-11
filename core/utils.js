

export async function getSessionFromCtx({ ctx }){
	let sessionToken = ctx.cookies.get('session_token')

	if(!sessionToken)
		return

	return await system.getSessionBy({
		token: sessionToken
	})
}

export async function requireAccount({ ctx }){
	let system = getSystem()
	let sessionToken = ctx.cookies.get('session_token')

	if(!sessionToken)
		throw {
			message: 'You are no longer signed in. Please refresh the page and sign in.'
		}

	let session = await system.getSessionBy({
		token: sessionToken
	})

	if(!session)
		throw {
			message: 'Your session has expired. Please refresh the page and sign in again.',
			expose: true
		}

	return await system.getAccountBy({
		id: session.account.id
	})
}
