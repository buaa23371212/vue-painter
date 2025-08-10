<script setup lang="ts">
import DrawingBoard from '../components/DrawingBoard.vue'
</script>

<template>
	<section class="drawing-board-container">
		<DrawingBoard />
	</section>
</template>

<style scoped>
/* 绘图板容器居中样式 */
.drawing-board-container {
	/* 网格项水平居中 */
	justify-self: center;
	/* 可以根据需要调整宽度 */
	width: 100%;
	/* 设置最大宽度限制 */
	max-width: 800px;
}
</style>
