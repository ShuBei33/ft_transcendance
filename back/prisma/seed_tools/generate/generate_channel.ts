import { PrismaClient, ChanUsr, Channel } from "@prisma/client";
import { LIST_RAND_CHAN } from "../data/rand_channels";
import { rand } from "./random";

const prisma = new PrismaClient();

//////////////////////////////////////////////////////////////////////////////////////////////
//																							//
//		Verifier que le nom du channel n'est pas deja pris	                                                    //
//																							//
//////////////////////////////////////////////////////////////////////////////////////////////
async function checkUniqueChanName(name: string) {
    const existingChannel = await prisma.channel.findFirst({
        where: {
          name: name
        }
    });
    return !!existingChannel;
}

//////////////////////////////////////////////////////////////////////////////////////////////
//																							//
//		Creation d'un channel par user			                                                    //
//																							//
//////////////////////////////////////////////////////////////////////////////////////////////
export async function generate_channels() {
    
    const users = await prisma.user.findMany();
    for (const user of users) {
        
        // create channel
        let chanName = LIST_RAND_CHAN[ rand( LIST_RAND_CHAN.length )];
        while (await checkUniqueChanName(chanName)) {
            chanName = LIST_RAND_CHAN[ rand( LIST_RAND_CHAN.length )];
        }
		const channelCreated = await prisma.channel.create({
			data: {
				name: chanName,
				visibility: 'PUBLIC'
			}
        });

        //create usrChan and connect it to the created channel
        await prisma.chanUsr.create({
            data: {
                user: { connect: {id: user.id}},
                channel: { connect: {id: channelCreated.id}},
                role: 'OWNER',
                status: 'NORMAL'
            }
        })
        console.log(`User: ${user.pseudo} created channel "${chanName}".`);
	}
}
