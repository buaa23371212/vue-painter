<template>
    <div class="toolbar">
        <ToolGroup :currentTool="currentTool" @tool-change="handleToolChange" />

        <ShapePicker :currentShape="currentShape" @shape-change="handleShapeChange" />

        <ColorPicker :currentColor="currentColor" :colorOptions="colorOptions" @color-change="handleColorChange" />

        <div class="toolbar-actions">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import ToolGroup from './ToolGroup.vue'
import ShapePicker from './ShapePicker.vue'
import ColorPicker from './ColorPicker.vue'

export default {
    name: 'Toolbar',
    components: {
        ToolGroup,
        ShapePicker,
        ColorPicker
    },
    props: {
        currentTool: {
            type: String,
            required: true,
            default: 'pencil'
        },
        currentShape: {
            type: String,
            required: true,
            default: 'line'
        },
        currentColor: {
            type: String,
            required: true,
            default: '#000000'
        },
        colorOptions: {
            type: Array,
            required: true,
            default: () => [
                '#000000', '#e74c3c', '#3498db',
                '#2ecc71', '#f39c12', '#9b59b6'
            ]
        }
    },
    methods: {
        handleToolChange(tool) {
            this.$emit('tool-change', tool)
        },
        handleShapeChange(shape) {
            this.$emit('shape-change', shape)
        },
        handleColorChange(color) {
            this.$emit('color-change', color)
        }
    }
}
</script>

<style scoped>
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

.toolbar-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    /* 按钮之间的间距 */
}

/* 可选：为工具栏操作区中的按钮提供基础样式 */
.toolbar-actions button {
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    padding: 10px 15px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
}

.toolbar-actions button:hover {
    background: #f0f0f0;
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .toolbar {
        flex-direction: column;
        gap: 15px;
    }
}
</style>