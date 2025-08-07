<template>
    <div class="canvas-wrapper">
        <div class="canvas-container">
            <canvas id="main-canvas" @mousedown="handleMouseDown" @mousemove="handleMouseMove" @mouseup="handleMouseUp"
                @mouseout="handleMouseOut">
            </canvas>
        </div>
        <layer-manager ref="layerManager" @layerChanged="handleLayerChanged" @redrawAllLayers="redrawAllLayers" />
    </div>
</template>

<script>
import LayerManager from './LayerManager.vue';

export default {
    name: 'CanvasContainer',
    components: {
        LayerManager
    },
    props: {
        currentColor: {
            type: String,
            default: '#000000'
        },
        brushSize: {
            type: Number,
            default: 5
        },
        currentTool: {
            type: String,
            default: 'pencil'
        }
    },
    data() {
        return {
            mainCanvas: null,
            mainCtx: null,
            currentLayerCanvas: null,
            currentLayerCtx: null,
            isDrawing: false,
            lastX: 0,
            lastY: 0
        }
    },
    mounted() {
        // 初始化主画布
        this.mainCanvas = document.getElementById('main-canvas');
        this.mainCtx = this.mainCanvas.getContext('2d');
        this.resizeCanvas();

        // 初始化图层管理器
        this.currentLayerCanvas = this.$refs.layerManager.initLayerCanvases(
            this.mainCanvas.width,
            this.mainCanvas.height
        );
        this.currentLayerCtx = this.currentLayerCanvas.getContext('2d');
        this.initCanvasSettings();

        // 监听窗口大小变化
        window.addEventListener('resize', this.resizeCanvas);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeCanvas);
    },
    methods: {
        resizeCanvas() {
            const container = this.mainCanvas.parentElement;
            const { clientWidth, clientHeight } = container;

            // 调整主画布大小
            this.mainCanvas.width = clientWidth;
            this.mainCanvas.height = clientHeight;

            // 调整所有图层大小（增加校验）
            this.$refs.layerManager.layers.forEach(layer => {
                if (!layer.canvas) return; // 跳过未初始化 canvas 的图层
                // 保存原图层内容
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = layer.canvas.width;
                tempCanvas.height = layer.canvas.height;
                tempCanvas.getContext('2d').drawImage(layer.canvas, 0, 0);

                // 调整大小并恢复内容
                layer.canvas.width = clientWidth;
                layer.canvas.height = clientHeight;
                layer.canvas.getContext('2d').drawImage(tempCanvas, 0, 0);
            });

            this.redrawAllLayers();
        },
        initCanvasSettings() {
            this.currentLayerCtx.strokeStyle = this.currentColor;
            this.currentLayerCtx.lineWidth = this.brushSize * 2;
            this.currentLayerCtx.lineCap = 'round';
            this.currentLayerCtx.lineJoin = 'round';
        },
        handleLayerChanged(canvas) {
            this.currentLayerCanvas = canvas;
            this.currentLayerCtx = canvas.getContext('2d');
            this.initCanvasSettings();
            this.redrawAllLayers();
        },
        redrawAllLayers() {
            // 清空主画布
            this.mainCtx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);

            // 绘制所有可见且有效的图层
            const visibleLayers = this.$refs.layerManager.getVisibleLayers();
            visibleLayers.forEach(layer => {
                // 新增校验：确保图层包含有效的 canvas 元素
                if (layer?.canvas && layer.canvas instanceof HTMLCanvasElement) {
                    this.mainCtx.drawImage(layer.canvas, 0, 0);
                } else {
                    console.warn('无效的图层画布', layer); // 打印无效图层便于调试
                }
            });
        },
        handleMouseDown(e) {
            this.isDrawing = true;
            [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
        },
        handleMouseMove(e) {
            if (!this.isDrawing) return;

            this.currentLayerCtx.beginPath();
            this.currentLayerCtx.moveTo(this.lastX, this.lastY);
            this.currentLayerCtx.lineTo(e.offsetX, e.offsetY);
            this.currentLayerCtx.strokeStyle = this.currentColor;
            this.currentLayerCtx.lineWidth = this.brushSize * 2;
            this.currentLayerCtx.stroke();

            [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
            this.redrawAllLayers();
        },
        handleMouseUp() {
            this.isDrawing = false;
        },
        handleMouseOut() {
            this.isDrawing = false;
        },
        clearCanvas() {
            this.$refs.layerManager.clearCurrentLayer();
        }
    },
    watch: {
        currentColor() {
            if (this.currentLayerCtx) {
                this.currentLayerCtx.strokeStyle = this.currentColor;
            }
        },
        brushSize() {
            if (this.currentLayerCtx) {
                this.currentLayerCtx.lineWidth = this.brushSize * 2;
            }
        }
    }
}
</script>

<style scoped>
.canvas-wrapper {
    display: flex;
    gap: 20px;
    align-items: flex-start;
}

.canvas-container {
    position: relative;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    height: 500px;
    flex-grow: 1;
}

canvas {
    background: white;
    cursor: crosshair;
    width: 100%;
    height: 100%;
}

@media (max-width: 768px) {
    .canvas-wrapper {
        flex-direction: column;
    }

    .canvas-container {
        height: 400px;
    }
}
</style>