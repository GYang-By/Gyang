<style>
	
</style>
<template>
	<div class="container">
		<!-- <loading/> -->
		<button @click="showLoading">点我出 loading</button>

		<button @click="hideLoading">点我隐藏 loading</button>

		<h1 v-for="i in 50">{{i}}</h1>
	</div>
</template>
<script>
	import Loading from './wc-loading/Loading'
	export default {
		name: 'App',
		components: {
			// Loading
		},
		methods: {
			showLoading () {
				this.$loading.show();
			},

			hideLoading () {
				this.$loading.hide();
			}

		}
	}
</script>