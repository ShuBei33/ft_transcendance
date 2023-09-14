<script lang="ts">
  import type { Game as GameType } from "$lib/models/prismaSchema";
  import AvatarFrame from "../../../components/nav/social/avatarFrame.svelte";
  import { classNames as cn } from "$lib/utils/classNames";
  import type { ClassNamesObject } from "$lib/utils/classNames";
  import Typography from "../../../components/Typography.svelte";
  export let history: GameType[] = [];
  export let profileOfUserId: string;

  const matchCn = (match: GameType): ClassNamesObject => {
    const isLoser = match.winnerId != Number(profileOfUserId);
    return {
      oneMatch: true,
      loss: isLoser,
      win: !isLoser,
    };
  };

  const getScoreString = (match: GameType): string => {
    const isLhsForfeit =
      match.lhsScore > match.rhsScore && match.winnerId != match.lhsPlayerId;
    const isRhsForfeit =
      match.rhsScore > match.lhsScore && match.winnerId != match.rhsPlayerId;
    if (isLhsForfeit) return `(forfeit) ${match.lhsScore} VS ${match.rhsScore}`;
    if (isRhsForfeit) return `${match.lhsScore} VS ${match.rhsScore} (forfeit)`;
    return `${match.lhsScore} VS ${match.rhsScore}`;
  };
</script>

<div class="match-history-wrapper">
  {#each history as match}
    <div class={cn(matchCn(match))}>
      <div class="avatar-frame-wrapper">
        <AvatarFrame userId={String(match.lhsPlayerId)} />
        <Typography class="... user-pseudo-link"
          >{match.lhsPlayer.pseudo}</Typography
        >
      </div>
      <Typography big class="... vs">{getScoreString(match)}</Typography>
      <div class="avatar-frame-wrapper">
        <Typography class="... user-pseudo-link"
          >{match.rhsPlayer.pseudo}</Typography
        >
        <AvatarFrame userId={String(match.rhsPlayerId)} />
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
  @import "../../../lib/style/colors.scss";
  .oneMatch {
    display: flex;
    justify-content: space-between;
    padding: 0.5em;
    border-radius: 3px;
    flex-direction: row;
    &.win {
      background-color: $keppel;
    }
    &.loss {
      background-color: $fierFuchsia;
    }
  }
  .match-history-wrapper {
    width: 80vw;
    display: flex;
    flex-direction: column;
    row-gap: 1em;
  }
  :global(.vs) {
    display: flex;
    align-items: center;
  }
  .avatar-frame-wrapper {
    display: flex;
    flex-direction: row;
    column-gap: 0.5em;
  }
</style>
