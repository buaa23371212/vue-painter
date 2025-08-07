<template>
    <div class="canvas-container">
        <canvas ref="mainCanvas" @mousedown="handleMouseDown" @mousemove="handleMouseMove" @mouseup="handleMouseUp"
            @mouseout="handleMouseOut"></canvas>
    </div>
</template>

<script>
import throttle from 'lodash/throttle';

export default {
    name: 'MainCanvas',
    props: {
        currentColor: String,
        brushSize: Number,
        currentTool: String,
        currentLayerCanvas: HTMLCanvasElement
    },
    data() {
        return {
            isDrawing: false,
            lastX: 0,
            lastY: 0
        };
    },
    mounted() {
        this.resizeCanvas();
        window.addEventListener('resize', this.resizeCanvas);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeCanvas);
    },
    methods: {
        getCanvasSize() {
            return {
                width: this.$refs.mainCanvas.width,
                height: this.$refs.mainCanvas.height
            };
        },
        resizeCanvas() {
            const canvas = this.$refs.mainCanvas;
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            this.$emit('resize', {
                width: canvas.width,
                height: canvas.height
            });
        },
        redraw(layers) {
            const ctx = this.$refs.mainCanvas.getContext('2d');
            ctx.clearRect(0, 0, this.$refs.mainCanvas.width, this.$refs.mainCanvas.height);

            layers.forEach(layer => {
                if (layer?.canvas && layer.canvas.width > 0 && layer.canvas.height > 0) {
                    ctx.drawImage(layer.canvas, 0, 0);
                }
            });
        },
        handleMouseDown(e) {
            if (!this.currentLayerCanvas) return;
            this.isDrawing = true;
            [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
        },
        handleMouseMove: throttle(function (e) {
            if (!this.isDrawing || !this.currentLayerCanvas) return;

            const ctx = this.currentLayerCanvas.getContext('2d');
            ctx.beginPath();
            ctx.moveTo(this.lastX, this.lastY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.strokeStyle = this.currentColor;
            ctx.lineWidth = this.brushSize * 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();

            [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
            this.$emit('request-redraw');
        }, 16),
        handleMouseUp() {
            this.isDrawing = false;
        },
        handleMouseOut() {
            this.isDrawing = false;
        }
    },
    watch: {
        currentColor() {
            if (this.currentLayerCanvas) {
                this.currentLayerCanvas.getContext('2d').strokeStyle = this.currentColor;
            }
        },
        brushSize() {
            if (this.currentLayerCanvas) {
                this.currentLayerCanvas.getContext('2d').lineWidth = this.brushSize * 2;
            }
        }
    }
};
</script>

<style scoped>
.canvas-container {
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
    .canvas-container {
        height: 400px;
    }
}
</style>