import { Component, VStack, Text } from '@architekt/ui'
import { Form, TextInput, SubmitButton, Issue, CodeInput, createModel } from '@architekt/forms'
import { requestRecovery } from 'api:@accountkit/core/api'
import { createRecoveryRequestModel } from '../core/models.js'
import Alert from './Alert.js'


export default Component(({ ctx, afterRequested }) => {
	let model = createRecoveryRequestModel({
		submit: async data => {
			await requestRecovery(data)
			afterRequested(data)
		}
	})

	return () => {
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
	}
})