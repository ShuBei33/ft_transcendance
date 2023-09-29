import { UserStatus } from "@prisma/client";

export class UserLite {
	login: string;
	pseudo: string;
	id: number;
	status: UserStatus;
	otpAuthUrl: string;
	// twoFA: boolean;
	twoFASecret: string;
}