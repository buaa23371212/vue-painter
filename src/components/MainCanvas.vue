<template>
    <div class="canvas-container">
        <!-- 主画布元素 -->
        <!-- 
          事件处理：
          - mousedown: 开始绘制
          - mousemove: 绘制过程（节流处理）
          - mouseup: 结束绘制
          - mouseout: 离开画布时结束绘制
         -->
        <canvas ref="mainCanvas" 
                @mousedown="handleMouseDown" 
                @mousemove="handleMouseMove" 
                @mouseup="handleMouseUp"
                @mouseout="handleMouseOut"></canvas>
    </div>
</template>

<script>
import throttle from 'lodash/throttle';  // 引入节流函数优化性能
import logger from '@/console_logger/logger'  // 引入日志记录器

/**
 * 主画布组件
 * 功能：
 * 1. 提供绘图区域并处理所有绘图操作
 * 2. 实现画笔、橡皮擦等工具的核心绘图逻辑
 * 3. 管理画布尺寸响应式调整
 * 4. 协调图层渲染与用户交互
 */
export default {
    name: 'MainCanvas',
    props: {
        currentColor: String,      // 当前画笔颜色
        brushSize: Number,         // 当前画笔尺寸
        currentTool: String,       // 当前激活工具（画笔/橡皮擦等）
        currentLayerCanvas: HTMLCanvasElement  // 当前激活图层的canvas元素
    },
    data() {
        return {
            isDrawing: false,  // 标记是否正在绘制
            lastX: 0,          // 上一个鼠标X坐标
            lastY: 0           // 上一个鼠标Y坐标
        };
    },
    mounted() {
        // 组件挂载后初始化画布尺寸
        this.resizeCanvas();
        // 监听窗口大小变化事件
        window.addEventListener('resize', this.resizeCanvas);
    },
    beforeDestroy() {
        // 组件销毁前移除事件监听
        window.removeEventListener('resize', this.resizeCanvas);
    },
    methods: {
        /**
         * 获取当前画布尺寸
         * @returns {Object} 包含width和height的对象
         */
        getCanvasSize() {
            return {
                width: this.$refs.mainCanvas.width,
                height: this.$refs.mainCanvas.height
            };
        },

        /**
         * 调整画布尺寸以适应容器
         * 同时触发resize事件通知父组件
         */
        resizeCanvas() {
            const canvas = this.$refs.mainCanvas;
            const container = canvas.parentElement;
            
            // TODO: 设置画布尺寸与父容器一致
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            
            // 通知父组件画布尺寸已变化
            this.$emit('resize', {
                width: canvas.width,
                height: canvas.height
            });
        },

        /**
         * 重绘所有可见图层到主画布
         * @param {Array} layers - 可见图层数组
         */
        redraw(layers) {
            const ctx = this.$refs.mainCanvas.getContext('2d');
            
            // 清除主画布
            ctx.clearRect(0, 0, this.$refs.mainCanvas.width, this.$refs.mainCanvas.height);
            
            // 按顺序绘制所有可见图层
            layers.forEach(layer => {
                if (layer?.canvas && layer.canvas.width > 0 && layer.canvas.height > 0) {
                    ctx.drawImage(layer.canvas, 0, 0);
                }
            });
        },

        /**
         * 鼠标按下事件处理
         * @param {MouseEvent} e - 鼠标事件对象
         */
        handleMouseDown(e) {
            // 没有激活图层时不处理
            if (!this.currentLayerCanvas) return;
            
            this.isDrawing = true;
            [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
            
            // 记录调试信息
            logger.debug('鼠标按下 - 鼠标事件坐标:', { x: e.offsetX, y: e.offsetY });
            logger.debug('鼠标按下 - 画布实际坐标:', { x: this.lastX, y: this.lastY });
        },

        /**
         * 鼠标移动事件处理（节流优化）
         * 实现核心绘图逻辑
         */
        handleMouseMove: throttle(function (e) {
            // 非绘制状态或无激活图层时不处理
            if (!this.isDrawing || !this.currentLayerCanvas) return;
            
            const ctx = this.currentLayerCanvas.getContext('2d');
            
            // 绘制路径
            ctx.beginPath();
            ctx.moveTo(this.lastX, this.lastY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.strokeStyle = this.currentColor;
            ctx.lineWidth = this.brushSize * 2;  // 乘以2使视觉大小更自然
            ctx.lineCap = 'round';               // 圆形线帽
            ctx.lineJoin = 'round';              // 圆形连接
            ctx.stroke();
            
            // 更新最后坐标
            [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
            
            // 请求重绘主画布
            this.$emit('request-redraw');
        }, 16),  // 约60fps的节流间隔

        /**
         * 鼠标释放事件处理
         */
        handleMouseUp() {
            this.isDrawing = false;
            logger.debug('Mouse Up');
        },

        /**
         * 鼠标离开画布事件处理
         */
        handleMouseOut() {
            this.isDrawing = false;
        }
    },
    watch: {
        /**
         * 监听画笔颜色变化
         */
        currentColor() {
            if (this.currentLayerCanvas) {
                this.currentLayerCanvas.getContext('2d').strokeStyle = this.currentColor;
            }
        },
        
        /**
         * 监听画笔尺寸变化
         */
        brushSize() {
            if (this.currentLayerCanvas) {
                this.currentLayerCanvas.getContext('2d').lineWidth = this.brushSize * 2;
            }
        }
    }
};
</script>

<style scoped>
/* 画布容器样式 */
.canvas-container {
    background: white;               /* 白色背景 */
    border-radius: 12px;             /* 圆角边框 */
    overflow: hidden;                /* 隐藏溢出内容 */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);  /* 柔和阴影 */
    height: 500px;                   /* 默认高度 */
    flex-grow: 1;                    /* 填充可用空间 */
}

/* 画布元素样式 */
canvas {
    background: white;               /* 白色背景 */
    cursor: crosshair;               /* 十字光标 */
    width: 100%;                     /* 宽度填满容器 */
    height: 100%;                    /* 高度填满容器 */
}

/* 响应式设计：小屏幕调整 */
@media (max-width: 768px) {
    .canvas-container {
        height: 400px;  /* 移动端减小高度 */
    }
}
</style>