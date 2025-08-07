<template>
    <div class="canvas-container">
        <canvas id="drawing-canvas" @mousedown="handleMouseDown" @mousemove="handleMouseMove" @mouseup="handleMouseUp"
            @mouseout="handleMouseOut"></canvas>
    </div>
</template>

<script>
export default {
    name: 'CanvasContainer',
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
            canvas: null,
            ctx: null,
            isDrawing: false,
            lastX: 0,
            lastY: 0
        }
    },
    mounted() {
        // 初始化画布
        this.canvas = document.getElementById('drawing-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        this.initCanvasSettings();

        // 监听窗口大小变化
        window.addEventListener('resize', this.resizeCanvas);
    },
    beforeDestroy() {
        // 组件销毁时移除事件监听（使用beforeDestroy钩子替代$once）
        window.removeEventListener('resize', this.resizeCanvas);
    },
    methods: {
        resizeCanvas() {
            const container = this.canvas.parentElement;
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
        },
        initCanvasSettings() {
            this.ctx.strokeStyle = this.currentColor;
            this.ctx.lineWidth = this.brushSize * 2;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
        },
        handleMouseDown(e) {
            this.isDrawing = true;
            [this.lastX, this.lastY] = [e.offsetX, e.offsetY];

            console.log('鼠标按下事件触发');
        },
        handleMouseMove(e) {
            if (!this.isDrawing) return;

            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(e.offsetX, e.offsetY);
            this.ctx.strokeStyle = this.currentColor;
            this.ctx.lineWidth = this.brushSize * 2;
            this.ctx.stroke();

            [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
        },
        handleMouseUp() {
            this.isDrawing = false;

            console.log('鼠标抬起事件触发');
        },
        handleMouseOut() {
            this.isDrawing = false;
        },
        clearCanvas() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    },
    watch: {
        currentColor() {
            this.ctx.strokeStyle = this.currentColor;
        },
        brushSize() {
            this.ctx.lineWidth = this.brushSize * 2;
        }
    }
}
</script>

<style scoped>
.canvas-container {
    position: relative;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    height: 500px;
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