import { IsNotEmpty, IsEnum, IsInt, Length, IsDate } from 'class-validator';
import { User, Channel, ChanUsr, ChannelMsg } from '@prisma/client';
import { ChanVisibility, ChanUsrRole, UserStatusMSGs } from '@prisma/client';

export class DTOCreateChan {
  @IsNotEmpty()
  @Length(1, 50)
  name: Channel['name'];

  @IsEnum(ChanVisibility)
  visibility: Channel['visibility'];

  hash?: Channel['hash'];
}

export class DTOJoinChan {
  hash?: Channel['hash'];
}

export class DTOInviteChan {
  @IsInt()
  userId: User['id'];
}

export class DTOUpdateChan {
  name?: Channel['name'];
  visibility?: Channel['visibility'];
  hash?: Channel['hash'];
}
export type DTOCreateMessage = Pick<
  ChannelMsg,
  'channelId' | 'userId' | 'content'
>;

export class DTOUpdateChanUsr {
  @IsInt()
  id: ChanUsr['id'];

  role?: ChanUsrRole;
  status?: UserStatusMSGs;
  statusDuration?: Date;
}
