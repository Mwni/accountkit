import { randomBytes } from 'crypto'


export function generateToken({ segments, charactersPerSegment }){
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

	return Array(segments)
		.fill(0)
		.map(() => {
			let bytes = randomBytes(charactersPerSegment)
			let str = ''

			for(let i=0; i<bytes.length; i++){
				str += alphabet[bytes[i] % alphabet.length]
			}

			return str
		})
		.join('-')
}

export function generateCode({ digits }){
	const alphabet = '0123456789'

	let bytes = randomBytes(digits)
	let str = ''

	for(let i=0; i<bytes.length; i++){
		str += alphabet[bytes[i] % alphabet.length]
	}

	return str
}