<template>
    <div class="container">
        <header>
            <h1>简易画板应用</h1>
            <div class="subtitle">鼠标拖动在画布上留下轨迹 | 工具栏已预留扩展位置</div>
        </header>

        <div class="app-content">
            <Toolbar :current-tool="currentTool" :current-color="currentColor" :color-options="colorOptions"
                @tool-change="currentTool = $event" @color-change="setCurrentColor" @clear-canvas="clearCanvas">
                <!-- 画笔大小控制 - 仅在选择画笔或形状工具时显示 -->
                <div class="brush-size" v-if="['pencil', 'shape'].includes(currentTool)">
                    <span>画笔大小: </span>
                    <div class="size-preview" :style="{
                        width: `${brushSize * 2 + 10}px`,
                        height: `${brushSize * 2 + 10}px`
                    }">{{ brushSize }}</div>
                    <input type="range" id="brush-size" min="1" max="30" v-model="brushSize" @input="updateBrushSize">
                </div>

                <!-- 清空画布按钮 -->
                <button class="action-btn" @click="clearCanvas">清空画布</button>
            </Toolbar>

            <CanvasContainer ref="canvasContainer" :current-color="currentColor" :brush-size="brushSize"
                :current-tool="currentTool" />

            <div class="instructions">
                <h3>使用说明：</h3>
                <ul>
                    <li>使用鼠标在画布上拖动即可绘制图形</li>
                    <li>从颜色选择器中选择不同的画笔颜色</li>
                    <li>调整下方的滑块改变画笔大小</li>
                    <li>点击"清空画布"按钮可以重置画布</li>
                    <li>工具栏区域已预留，后续可扩展其他功能</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import Toolbar from './Toolbar.vue'
import CanvasContainer from './CanvasContainer.vue'

export default {
    name: 'DrawingBoard',
    components: {
        Toolbar,
        CanvasContainer
    },
    data() {
        return {
            currentColor: '#000000',
            brushSize: 5,
            currentTool: 'pencil',
            colorOptions: [
                '#000000', '#e74c3c', '#3498db',
                '#2ecc71', '#f39c12', '#9b59b6'
            ]
        }
    },
    methods: {
        setCurrentColor(color) {
            this.currentColor = color;
        },
        clearCanvas() {
            // 调用子组件的清空方法
            this.$refs.canvasContainer.clearCanvas();
        }
    }
}
</script>

<style scoped>
/* 保留原CSS样式，移除全局选择器的影响 */
::v-deep * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
    width: 100%;
    max-width: 900px;
    background: rgba(255, 255, 255, 0.92);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    overflow: hidden;
}

header {
    background: #2c3e50;
    color: white;
    padding: 20px;
    text-align: center;
}

h1 {
    font-size: 2.2rem;
    margin-bottom: 8px;
    letter-spacing: 1px;
}

.subtitle {
    font-size: 1rem;
    opacity: 0.8;
}

.app-content {
    display: flex;
    flex-direction: column;
    padding: 20px;
}

.toolbar {
    display: flex;
    justify-content: space-between;
    background: #f8f9fa;
    border-radius: 12px;
    padding: 15px;
    margin-bottom: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    flex-wrap: wrap;
}

.tool-group {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.tool-btn {
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    padding: 10px 15px;
    cursor: pointer;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
}

.tool-btn:hover {
    background: #f0f0f0;
    transform: translateY(-2px);
}

.tool-btn.active {
    background: #3498db;
    color: white;
    border-color: #2980b9;
}

.tool-btn span {
    font-size: 18px;
}

.color-picker {
    display: flex;
    align-items: center;
    gap: 10px;
}

.color-option {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
    transition: transform 0.2s;
}

.color-option:hover {
    transform: scale(1.15);
}

.color-option.active {
    border-color: #2c3e50;
    transform: scale(1.2);
}

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

.footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: #f8f9fa;
    border-top: 1px solid #e0e0e0;
}

.brush-size {
    display: flex;
    align-items: center;
    gap: 10px;
}

.size-preview {
    background: #2c3e50;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
}

input[type="range"] {
    width: 120px;
}

.action-btn {
    padding: 10px 20px;
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.3s;
}

.action-btn:hover {
    background: #c0392b;
}

.instructions {
    background: #e3f2fd;
    border-left: 4px solid #3498db;
    padding: 15px;
    border-radius: 0 8px 8px 0;
    margin-top: 20px;
    font-size: 0.9rem;
}

.instructions h3 {
    margin-bottom: 8px;
    color: #2c3e50;
}

.instructions ul {
    padding-left: 20px;
}

.instructions li {
    margin-bottom: 5px;
}

@media (max-width: 768px) {
    .toolbar {
        flex-direction: column;
        gap: 15px;
    }

    .tool-group {
        justify-content: center;
    }

    .footer {
        flex-direction: column;
        gap: 15px;
    }

    .canvas-container {
        height: 400px;
    }
}
</style>