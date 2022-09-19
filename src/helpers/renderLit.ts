import Application from "koa"
import { HTMLTemplateResult } from "lit-html"

export const getRenderString = (data: HTMLTemplateResult) => {
	const {strings, values} = data
	const v: string[] = [...(values as string[] | object[]), ""].map(e => typeof e === "object" ? getRenderString(e as HTMLTemplateResult) : e )   
	return strings.reduce((acc,s, i) => acc + s + v[i], "")
}

export const renderLitMiddleware: Application.Middleware<Application.DefaultState, Application.DefaultContext, any> = async (ctx, next) => {
	await next()

	if (ctx.body["_$litType$"]) {
		ctx.type = "html"
		ctx.body = getRenderString(ctx.body)
	}
}