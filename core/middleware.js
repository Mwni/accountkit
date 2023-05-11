import createSystem from './system.js'


export function createMiddleware(config){
	return async (ctx, next) => {
		Object.assign(ctx.state, {
			accountkit: createSystem(config)
		})

		await next(ctx)
	}
}