<template>
	<view>
		<xswiper />
		<xaudio />
		<xmediaList />
		<xmap />
		<xwebview />
	</view>
</template>

<script>
	import xaudio from '../../components/audio/audio.vue'
	import xmap from '../../components/map/map.vue'
	import xswiper from '../../components/swiper/swiper.vue'
	import xmediaList from '../../components/media-list/media-list.vue'
	import xwebview from '../../components/web-view/web-view.vue'
	export default {
		data() {
			return {
				
			};
		},
		components:{
			xaudio,
			xmediaList,
			xmap,
			xswiper,
			xwebview
		},
		onReachBottom(){
			console.log('到底了')
		}
	}
</script>

<style>

</style>
