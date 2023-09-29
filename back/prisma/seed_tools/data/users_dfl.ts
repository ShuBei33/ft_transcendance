export interface GEN_CreateUser {
	login : string,
	pseudo : string,
	rank : number,
}

const USER_ECLIPSE: GEN_CreateUser = {
	login : "motoure",
	pseudo : "CacheurDeSoleil",
	rank : 1800,
}

const USER_ENORA: GEN_CreateUser = {
	login : "estoffel",
	pseudo : "眠り姫",
	rank : 1800,
}

const USER_LIANA: GEN_CreateUser = {
	login : "lrandria",
	pseudo : "Hamtaro",
	rank : 1800,
}

const USER_NATHAN: GEN_CreateUser = {
	login : "ngobert",
	pseudo : "bladeefan123",
	rank : 1800,
}

const USER_MAXIME: GEN_CreateUser = {
	login : "mlormois",
	pseudo : "Ftsguf",
	rank : 1800,
}

export const USER_DFL: GEN_CreateUser[] = [
	USER_ECLIPSE,
	USER_ENORA,
	USER_LIANA,
	USER_NATHAN,
	USER_MAXIME
]