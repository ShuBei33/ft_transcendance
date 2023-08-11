import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetToken = createParamDecorator(
	(data: string | undefined, ctx: ExecutionContext) => {
		const request = ctx
			.switchToHttp()
			.getRequest();
		if (data == "access_token" || data == "refresh_token") {
			return request.user[data];
		}
		return { 
			access_token: request.user.access_token, 
			refresh_token: request.user.refresh_token
		}
	}
)