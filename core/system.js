import { hash, compare } from 'bcrypt'
import { generateToken, generateCode } from './random.js'


const maxSignInAttemptsPer10m = 10
const maxRecoveryMailsPer10m = 5
const maxRecoveryAttemptsPer10m = 10

export default ({ db, format, hooks }) => {
	async function getClientAccountBy(where){
		return await format.clientAccount(
			await db.accounts.readOne({
				where
			})
		)
	}

	async function getSessionFromCtx({ ctx }){
		let sessionToken = ctx.cookies.get('session_token')
	
		if(!sessionToken)
			return
	
		return await db.accountSessions.readOne({
			where: {
				token: sessionToken
			}
		})
	}

	async function assertCredentials({ email, password }){
		let account = await db.accounts.readOne({
			where: {
				email
			}
		})
	
		if(!account){
			throw {
				message: 'No account with this email.',
				expose: true
			}
		}
	
		if(!await compare(password, account.password)){
			throw {
				message: 'Incorrect password.',
				expose: true
			}
		}
	}

	async function createSession({ email, userAgent, ip }){
		let account = await db.accounts.readOne({
			where: {
				email
			}
		})
	
		if(!account){
			throw {
				message: 'No account with this email.',
				expose: true
			}
		}
	
		let token = generateToken({
			segments: 1,
			charactersPerSegment: 16
		})
	
		let previousSession = await db.accountSessions.readOne({
			where: {
				account,
				userAgent,
				ip
			}
		})
	
		if(previousSession){
			//todo
			return previousSession
		}

		return await db.accountSessions.createOne({
			data: {
				account,
				token,
				userAgent,
				ip
			}
		})
	}

	async function deleteSessionBy(where){
		await db.accountSessions.deleteOne({
			where
		})
	}

	async function createAccount({ email, password }){
		let account = await db.accounts.readOne({
			where: {
				email
			}
		})

		if(account){
			throw {
				message: 'This email is already reigstered.',
				expose: true
			}
		}
	
		let hashedPassword = await hash(password, 10)
	
		try{
			let account = await db.accounts.createOne({
				data: {
					email, 
					password: hashedPassword 
				}
			})

			await hooks.accountCreation({ account })
		}catch(error){
			throw {
				message: 'Accounts can not be created at this time.',
				expose: true
			}
		}
	}

	async function createRecovery({ email, userAgent, ip }){
		let account = await db.accounts.readOne({
			where: {
				email
			}
		})
	
		if(!account){
			throw {
				message: 'No account with this email.',
				expose: true
			}
		}
	
		try{
			let recovery = await db.accountRecoveries.createOne({
				data: {
					account, 
					code: generateCode({ digits: 6 }),
					userAgent,
					ip
				}
			})

			await hooks.recoveryCreation({ account, recovery })
		}catch(error){
			throw {
				message: 'Password reset emails cannot be sent out at the time.',
				expose: true
			}
		}
	}
		
	async function assertRecovery({ email, code }){
		let account = await db.accounts.readOne({
			where: {
				email
			}
		})

		if(!account){
			throw {
				message: 'No account with this email.',
				expose: true
			}
		}

		let recovery = await db.accountRecoveries.readOne({
			where: {
				account: {
					id: account.id
				},
				code
			}
		})

		if(!recovery){
			throw {
				message: 'Incorrect code.',
				expose: true
			}
		}

		return recovery
	}

	async function redeemRecovery({ accountkit, email, code, password }){
		let account = await db.accounts.readOne({
			where: {
				email
			}
		})

		if(!account){
			throw {
				message: 'No account with this email.',
				expose: true
			}
		}

		let recovery = await assertRecovery({
			accountkit,
			email,
			code
		})

		let hashedPassword = await hash(password, 10)

		await db.accountRecoveries.updateOne({
			data: {
				timeRedeemed: new Date()
			},
			where: {
				id: recovery.id
			}
		})

		await db.accounts.updateOne({
			data: {
				password: hashedPassword
			},
			where: {
				id: account.id
			}
		})

		await hooks.passwordChange({ account })
	}

	return {
		getClientAccountBy,
		getSessionFromCtx,
		assertCredentials,
		createSession,
		deleteSessionBy,
		createAccount,
		createRecovery,
		assertRecovery,
		redeemRecovery
	}
}