import { Fragment, HStack, Icon, Text, VStack } from '@architekt/ui'
import successIcon from '../assets/success.svg'
import infoIcon from '../assets/info.svg'
import errorIcon from '../assets/error.svg'

const icons = {
	success: successIcon,
	info: infoIcon,
	error: errorIcon
}


export default Fragment(({ type, class: cls, title, message }, content) => {
	HStack({ class: ['alert', `alert-${type}`, cls] }, () => {
		Icon({
			asset: icons[type]
		})
		VStack(() => {
			if(content)
				content()
			else{
				if(title)
					Text({
						text: title
					})

				Text({
					class: 'text-content2',
					text: message
				})
			}
		})
	})
})