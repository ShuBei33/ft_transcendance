import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

// UTILE POUR DEFINIR DES EXEMPLE D'UTILISATION DANS SWAGGER UNIQUEMENT
export const DTO_AnswerInvitationSchema = {
    type: 'object',
    properties: {
        answer: {
            type: 'boolean',
            examples: {
                exemple1: { value: true },
                exemple2: { value: false }
            }
        },
        senderId: {
            type: 'number',
            examples: {
                exemple1: { value: 1 },
                exemple2: { value: 1 }
            }
        }
    }
};

export class DTO_AnswerInvitation {
	
	@IsNotEmpty()
	@ApiProperty( {description: "La reponse a l'invitation", example: true, })
	answer: boolean;

	@IsNotEmpty()
	@ApiProperty( {description: "L'Id de la personne qui vous invite", example: 1, })
	senderId: number;
}