import { Component, VStack, Text, Fragment, HStack, Icon } from '@architekt/ui'
import { Form, TextInput, SubmitButton, Issue, CodeInput, createModel } from '@architekt/forms'
import { requestRecovery, checkRecoveryCode } from 'api:@accountkit/core/api'
import { createRecoveryCommitModel, createRecoveryRequestModel } from '../core/models.js'
import Alert from './Alert.js'
import iconTick from '../assets/tick.svg'


export default Component(({ ctx }) => {
	let requestModel = createRecoveryRequestModel({
		submit: async data => {
			await requestRecovery(data)

			requested = true
			ctx.redraw()
		}
	})

	let codeModel = createModel({
		data: {
			code: ''
		},
		submit: async ({ code }) => {
			await checkRecoveryCode({
				email: requestModel.data.email,
				code
			})

			codeValid = true
			ctx.redraw()
		}
	})

	let commitModel = createRecoveryCommitModel({
		submit: async data => {
			await requestRecovery(data)

			requested = true
			ctx.redraw()
		}
	})

	let requested = false
	let codeValid = false


	return () => {
		if(!requested){
			EmailForm({ model: requestModel })
		}else{
			CodeForm({ model: codeModel, valid: codeValid })

			if(codeValid)
				PasswordForm({ model: commitModel })
		}
	}
})


const EmailForm = Fragment(({ model }) => {
	Form({ model, class: 'form-group' }, () => {
		VStack({ class: 'form-field w-full' }, () => {
			Text({
				class: 'form-label',
				text: 'Email address'
			})
			TextInput({
				key: 'email',
				class: 'input max-w-full',
			})
			Issue({
				key: 'email',
				class: 'form-label-alt'
			})
		})
		Issue(({ message }) => {
			Alert({ 
				class: 'mb-1', 
				type: 'error',
				title: 'Cannot send email',
				message
			})
		})
		SubmitButton({
			class: 'btn btn-primary btn-block',
			classBusy: 'btn btn-loading btn-block',
			text: 'Send recovery code'
		})
	})
})


const CodeForm = Fragment(({ model, valid }) => {
	Form({ model, class: 'form-group' }, () => {
		VStack({ class: 'form-field w-full' }, () => {
			Text({
				class: 'form-label',
				text: `Enter the 6-digit code:`
			})
			HStack({ class: 'items-center gap-x-3' }, () => {
				CodeInput({
					class: 'gap-x-2',
					classInputs: 'input input-xl w-11 text-center code-digit',
					key: 'code',
					digits: 6,
					disabled: valid
				})

				if(valid){
					Icon({
						class: 'w-8 text-success',
						asset: iconTick
					})
				}
			})
		})
		Issue(({ message }) => {
			Alert({ 
				class: 'mb-1', 
				type: 'error',
				title: 'Cannot continue',
				message
			})
		})
	})
})


const PasswordForm = Fragment(({ model }) => {
	Form({ model, class: 'form-group mt-8' }, () => {
		VStack({ class: 'form-field w-full' }, () => {
			Text({
				class: 'form-label',
				text: 'Your new password'
			})
			TextInput({
				key: 'password',
				class: 'input max-w-full',
				secure: true,
				autoFocus: true
			})
			Issue({
				key: 'password',
				class: 'form-label-alt'
			})
		})
		Issue(({ message }) => {
			Alert({ 
				class: 'mb-1', 
				type: 'error',
				title: 'Cannot change password',
				message
			})
		})
		SubmitButton({
			class: 'btn btn-primary btn-block',
			classBusy: 'btn btn-loading btn-block',
			text: 'Change password and sign in'
		})
	})
})