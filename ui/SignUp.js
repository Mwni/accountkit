import { Component, VStack, Text } from '@architekt/ui'
import { Form, TextInput, Button, SubmitButton, Issue } from '@architekt/forms'
import { Link } from '@architekt/router'
import { signUp } from 'api:@accountkit/core/api'
import { createEmailSignUpModel } from '../core/models.js'
import Alert from './Alert.js'


export default Component(({ ctx, afterAccountCreated }) => {
	let model = createEmailSignUpModel({
		submit: async data => {
			ctx.upstream.account.set(
				await signUp(data)
			)

			if(afterAccountCreated)
				await afterAccountCreated()
		}
	})

	return ({ signIn }) => {
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
			VStack({ class: 'form-field w-full mb-8' }, () => {
				Text({
					class: 'form-label',
					text: 'Choose a password'
				})
				TextInput({
					key: 'password',
					class: 'input max-w-full',
					secure: true
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
					title: 'Sign up failed',
					message
				})
			})
			SubmitButton({
				class: 'btn btn-primary btn-block',
				classBusy: 'btn btn-loading btn-block',
				text: 'Create account'
			})
			VStack({ class: 'form-field w-full items-center' }, () => {
				if(signIn.link){
					Link({
						path: signIn.link,
						class: model.submitting
							? 'link link-underline-hover text-sm text-gray-7 pointer-events-none'
							: 'link link-underline-hover link-primary text-sm',
						text: 'Already got an account? Sign in.',
						back: true
					})
				}else{
					Button({
						class: 'link link-underline-hover link-primary text-sm',
						classBusy: 'link link-underline-hover text-sm text-gray-7',
						text: 'Already got an account? Sign in.',
						onTap: signIn.onTap
					})
				}
			})
		})
	}
})