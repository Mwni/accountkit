import { createEmailSignInModel, createEmailSignUpModel, createRecoveryCommitModel, createRecoveryRequestModel } from './models.js'


@post({ path: '/api/account' })
export async function getAccountByCookie({ ctx }){
	let session = await ctx.state.accountkit.getSessionFromCtx({ ctx })

	if(session){
		return ctx.state.accountkit.getClientAccountBy({
			id: session.account.id
		})
	}

}

@post({ path: '/api/account/signin' })
export async function signIn({ ctx, email, password }){
	let userAgent = ctx.headers['user-agent']
	let ip = ctx.headers['x-real-ip'] || ctx.ip
	let model = createEmailSignInModel({
		data: {
			email,
			password
		}
	})

	await new Promise(r => setTimeout(r, 250))
	await model.validate()

	await ctx.state.accountkit.assertCredentials({ 
		email, 
		password 
	})

	let session = await ctx.state.accountkit.createSession({ 
		email,
		userAgent,
		ip
	})

	ctx.cookies.set('session_token', session.token, {
		maxAge: 1000 * 60 * 60 * 24 * 365,
		//secure: true,
		overwrite: true
	})

	return await ctx.state.accountkit.getClientAccountBy({ email })
}

@post({ path: '/api/account/signup' })
export async function signUp({ ctx, email, password }){
	let model = createEmailSignUpModel({
		data: {
			email,
			password
		}
	})

	await new Promise(r => setTimeout(r, 250))
	await model.validate()

	await ctx.state.accountkit.createAccount({ 
		email, 
		password 
	})

	return signIn({ ctx, email, password })
}

@post({ path: '/api/account/signout' })
export async function signOut({ ctx }){
	let sessionToken = ctx.cookies.get('session_token')

	if(!sessionToken)
		return null

	await ctx.state.accountkit.deleteSessionBy({
		token: sessionToken
	})
}


@post({ path: '/api/account/recovery/request' })
export async function requestRecovery({ ctx, email }){
	let userAgent = ctx.headers['user-agent']
	let ip = ctx.headers['x-real-ip'] || ctx.ip
	let model = createRecoveryRequestModel({
		data: {
			email
		}
	})

	await new Promise(r => setTimeout(r, 250))
	await model.validate()

	await ctx.state.accountkit.createRecovery({
		email,
		userAgent,
		ip
	})
}

@post({ path: '/api/account/recovery/check' })
export async function checkRecoveryCode({ ctx, email, code }){
	await new Promise(r => setTimeout(r, 250))

	await ctx.state.accountkit.assertRecovery({
		email,
		code
	})
}

@post({ path: '/api/account/recovery/commit' })
export async function commitRecovery({ ctx, email, code, password }){
	let model = createRecoveryCommitModel({
		data: {
			email,
			code,
			password
		}
	})

	await new Promise(r => setTimeout(r, 250))
	await model.validate()

	await ctx.state.accountkit.redeemRecovery({
		email,
		code,
		password
	})

	return signIn({
		ctx,
		email,
		password
	})
}