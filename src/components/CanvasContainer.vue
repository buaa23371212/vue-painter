<template>
    <div class="canvas-wrapper">
        <!-- 主画布组件 -->
        <MainCanvas ref="mainCanvas" :currentColor="currentColor" :brushSize="brushSize" :currentTool="currentTool"
            :currentLayerCanvas="currentLayerCanvas" @request-redraw="redrawAllLayers" @resize="handleCanvasResize" />

        <!-- 独立的图层管理器组件 -->
        <LayerManager ref="layerManager" @layerChanged="handleLayerChanged" @redrawAllLayers="redrawAllLayers" />
    </div>
</template>

<script>
import LayerManager from './LayerManager.vue';
import MainCanvas from './MainCanvas.vue';

export default {
    name: 'CanvasContainer',
    components: {
        LayerManager,
        MainCanvas
    },
    props: {
        currentColor: String,
        brushSize: Number,
        currentTool: String
    },
    data() {
        return {
            currentLayerCanvas: null
        };
    },
    mounted() {
        // 初始化图层管理器并获取当前图层
        this.currentLayerCanvas = this.$refs.layerManager.initLayerCanvases(
            this.$refs.mainCanvas.getCanvasSize()
        );
    },
    methods: {
        handleCanvasResize(size) {
            this.$refs.layerManager.resizeAllCanvases(size);
        },
        handleLayerChanged(canvas) {
            this.currentLayerCanvas = canvas;
            this.redrawAllLayers();
        },
        redrawAllLayers() {
            const visibleLayers = this.$refs.layerManager.getVisibleLayers();
            this.$refs.mainCanvas.redraw(visibleLayers);
        },
        clearCanvas() {
            this.$refs.layerManager.clearCurrentLayer();
        }
    },
    beforeDestroy() {
        // 移除监听
        this.$refs.mainCanvas.$off('resize', this.handleCanvasResize);
    }
};
</script>

<style scoped>
.canvas-wrapper {
    display: flex;
    gap: 20px;
    align-items: flex-start;
    height: 100vh;
    /* 新增 */
}

@media (max-width: 768px) {
    .canvas-wrapper {
        flex-direction: column;
    }

    .layer-manager {
        max-height: 40vh;
        /* 新增 */
        overflow-y: auto;
        /* 新增 */
    }
}
</style>