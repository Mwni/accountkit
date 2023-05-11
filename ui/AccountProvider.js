import { Component } from '@architekt/ui'
import { getAccountByCookie, signOut } from 'api:@accountkit/core/api'


export default Component(async ({ ctx }, content) => {
	let account = {
		data: await getAccountByCookie(),
		get signedIn(){
			return !!account.data
		},
		set(data){
			account.data = data
			ctx.redraw()
		},
		async signOut(){
			await signOut()
			account.data = undefined
			ctx.redraw()
		}
	}

	ctx.public({ account })

	return content
})