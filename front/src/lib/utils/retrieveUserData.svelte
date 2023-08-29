<script lang="ts">
  import { onMount } from "svelte";
  import { Channel } from "$lib/apiCalls";
  import { data as dataStore } from "$lib/stores/data";
  import { ui } from "$lib/stores";
    import type {ChannelMsg} from "$lib/models/prismaSchema";
    import type {AxiosResponse} from "axios";
  onMount(() => {
    const _Channel = new Channel();
    _Channel.all().then(({ data }) => ($dataStore.channels = data.data));
	_Channel.mine().then(async ({ data }) => {
		const myChannels = data.data;
		const myChannelsIds: number[] = myChannels.map(chanusr => chanusr.channel.id);
		const myChannelsMessages = myChannelsIds.map(chanId => _Channel.msgs(chanId));
	
		// Retrieve every channel messages and append it inside the channels object
		await Promise.all(myChannelsMessages).then(ChannelMessages => {
			ChannelMessages.forEach((message, index) => {
				const { data } = message;
				if (data.data.length)
					myChannels[index].channel.channelMsgs = data.data;
			});
		});
		$dataStore.myChannels = myChannels;
	});
  });
</script>
