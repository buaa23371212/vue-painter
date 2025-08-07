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

            <Instructions />
        </div>
    </div>
</template>

<script>
import Toolbar from './Toolbar.vue'
import CanvasContainer from './CanvasContainer.vue'
import Instructions from './Instructions.vue'

export default {
    name: 'DrawingBoard',
    components: {
        Toolbar,
        CanvasContainer,
        Instructions
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
</style>