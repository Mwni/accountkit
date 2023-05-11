import { Component, VStack, Text } from '@architekt/ui'
import { Form, TextInput, Button, SubmitButton, Issue } from '@architekt/forms'
import { Link } from '@architekt/router'
import { signIn } from 'api:@accountkit/core/api'
import { createEmailSignInModel } from '../core/models.js'
import Alert from './Alert.js'


export default Component(({ ctx }) => {
	let model = createEmailSignInModel({
		submit: async data => {
			ctx.upstream.account.set(
				await signIn(data)
			)
		}
	})

	return ({ forgotPassword, signUp }) => {
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
			VStack({ class: 'form-field w-full' }, () => {
				Text({
					class: 'form-label',
					text: 'Password'
				})
				TextInput({
					key: 'password',
					class: 'input max-w-full',
					secure: true
				})
			})
			if(forgotPassword){
				VStack({ class: 'form-field w-full items-end mb-4' }, () => {
					if(forgotPassword.link){
						Link({
							path: forgotPassword.link,
							class: model.submitting
								? 'link link-underline-hover text-sm text-gray-7 pointer-events-none'
								: 'link link-underline-hover link-primary text-sm',
							text: 'Forgot password?'
						})
					}else{
						Button({
							class: 'link link-underline-hover link-primary text-sm',
							classBusy: 'link link-underline-hover text-sm text-gray-7',
							text: 'Forgot password?',
							onTap: forgotPassword.onTap
						})
					}
				})
			}
			Issue(({ message }) => {
				Alert({ 
					class: 'mb-1', 
					type: 'error',
					title: 'Sign in failed',
					message
				})
			})
			SubmitButton({
				class: 'btn btn-primary btn-block',
				classBusy: 'btn btn-loading btn-block',
				text: 'Sign in'
			})
			if(signUp){
				VStack({ class: 'form-field w-full items-center' }, () => {
					if(signUp.link){
						Link({
							path: signUp.link,
							class: model.submitting
								? 'link link-underline-hover text-sm text-gray-7 pointer-events-none'
								: 'link link-underline-hover link-primary text-sm',
							text: 'No account? Create one.'
						})
					}else{
						Button({
							class: 'link link-underline-hover link-primary text-sm',
							classBusy: 'link link-underline-hover text-sm text-gray-7',
							text: 'No account? Create one.',
							onTap: signUp.onTap
						})
					}
				})
			}
		})
	}
})