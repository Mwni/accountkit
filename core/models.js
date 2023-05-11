import { createModel } from '@architekt/forms'

export function createEmailSignInModel(overrides){
	return createModel({
		data: {
			email: '',
			password: ''
		},
		constraints: [
			{
				key: 'email',
				check: ({ email }) => {
					if(email.length === 0)
						throw 'This field is required.'

					if(!/^\S+@\S+\.\S+$/.test(email))
						throw 'Please enter a valid email.'
				}
			},
			{
				key: 'password',
				check: ({ password }) => {
					if(password.length === 0)
						throw 'This field is required.'
				}
			}
		],
		...overrides
	})
}


export function createEmailSignUpModel(overrides){
	return createModel({
		data: {
			email: '',
			password: ''
		},
		constraints: [
			{
				key: 'email',
				check: ({ email }) => {
					if(email.length === 0)
						throw 'This field is required.'

					if(!/^\S+@\S+\.\S+$/.test(email))
						throw 'Please enter a valid email.'
				}
			},
			{
				key: 'password',
				check: ({ password }) => {
					if(password.length === 0)
						throw 'This field is required.'

					if(password.length < 7)
						throw 'Please choose a password of at least 7 charactes.'
				}
			}
		],
		...overrides
	})
}


export function createRecoveryRequestModel(overrides){
	return createModel({
		data: {
			email: ''
		},
		constraints: [
			{
				key: 'email',
				check: ({ email }) => {
					if(email.length === 0)
						throw 'This field is required.'

					if(!/^\S+@\S+\.\S+$/.test(email))
						throw 'Please enter a valid email.'
				}
			}
		],
		...overrides
	})
}

export function createRecoveryCommitModel(overrides){
	return createModel({
		data: {
			email: '',
			code: '',
			password: ''
		},
		constraints: [
			{
				key: 'password',
				check: ({ password }) => {
					if(password.length === 0)
						throw 'This field is required.'

					if(password.length < 7)
						throw 'Please choose a password of at least 7 charactes.'
				}
			}
		],
		...overrides
	})
}