<template>
    <div class="layer-manager">
        <h3>图层管理</h3>
        <div class="layer-controls">
            <button @click="addLayer">+ 新建图层</button>
            <button @click="deleteLayer" :disabled="layers.length <= 1">- 删除图层</button>
            <button @click="moveUp" :disabled="currentLayerIndex === layers.length - 1">↑ 上移</button>
            <button @click="moveDown" :disabled="currentLayerIndex === 0">↓ 下移</button>
        </div>
        <div class="layers-list">
            <div v-for="(layer, index) in layers" :key="layer.id"
                :class="['layer-item', { 'active': index === currentLayerIndex }]" @click="setCurrentLayer(index)">
                <input type="checkbox" v-model="layer.visible" @change="onLayerVisibilityChange">
                <span>{{ layer.name }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {
    name: 'LayerManager',
    data() {
        return {
            layers: [
                { id: uuidv4(), name: '背景层', visible: true, canvas: document.createElement('canvas') }
            ],
            currentLayerIndex: 0
        };
    },
    methods: {
        // 初始化图层画布
        initLayerCanvases(containerWidth, containerHeight) {
            this.layers.forEach(layer => {
                const canvas = document.createElement('canvas');
                // 设置实际像素尺寸
                canvas.width = containerWidth;
                canvas.height = containerHeight;
                // 添加：设置canvas样式尺寸，确保与像素尺寸一致
                canvas.style.width = `${containerWidth}px`;
                canvas.style.height = `${containerHeight}px`;
                // 避免canvas默认样式导致的偏差
                canvas.style.display = 'block';
                canvas.style.position = 'absolute';
                canvas.style.top = '0';
                canvas.style.left = '0';
                layer.canvas = canvas;
            });
            return this.layers[this.currentLayerIndex].canvas;
        },
        resizeAllCanvases(size) {
            this.layers.forEach(layer => {
                layer.canvas.width = size.width;
                layer.canvas.height = size.height;
            });
        },
        // 获取当前活动图层的画布
        getCurrentLayerCanvas() {
            return this.layers[this.currentLayerIndex].canvas;
        },
        // 添加新图层
        addLayer() {
            const { width, height } = this.layers[0].canvas;
            const newLayer = {
                id: uuidv4(),
                name: `图层${this.layers.length}`,
                visible: true,
                canvas: document.createElement('canvas')
            };
            newLayer.canvas.width = width;
            newLayer.canvas.height = height;
            this.layers.push(newLayer);
            this.currentLayerIndex = this.layers.length - 1;
            this.$emit('layerChanged', this.getCurrentLayerCanvas());
        },
        // 删除当前图层
        deleteLayer() {
            if (this.layers.length <= 1) return;

            this.layers.splice(this.currentLayerIndex, 1);
            this.currentLayerIndex = Math.min(
                this.currentLayerIndex,
                this.layers.length - 1
            );
            this.$emit('layerChanged', this.getCurrentLayerCanvas());
        },
        // 设置当前图层
        setCurrentLayer(index) {
            this.currentLayerIndex = index;
            this.$emit('layerChanged', this.getCurrentLayerCanvas());
        },
        moveUp() {
            if (this.currentLayerIndex >= this.layers.length - 1) return;
            // 交换当前图层和上方图层的位置
            const upperIndex = this.currentLayerIndex + 1;
            [this.layers[this.currentLayerIndex], this.layers[upperIndex]] =
                [this.layers[upperIndex], this.layers[this.currentLayerIndex]];
            this.currentLayerIndex = upperIndex;
        },
        moveDown() {
            if (this.currentLayerIndex <= 0) return;
            // 交换当前图层和下方图层的位置
            const lowerIndex = this.currentLayerIndex - 1;
            [this.layers[this.currentLayerIndex], this.layers[lowerIndex]] =
                [this.layers[lowerIndex], this.layers[this.currentLayerIndex]];
            this.currentLayerIndex = lowerIndex;
        },
        // 图层可见性变化
        onLayerVisibilityChange() {
            this.$emit('redrawAllLayers');
        },
        // 清除当前图层
        clearCurrentLayer() {
            const canvas = this.getCurrentLayerCanvas();
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.$emit('redrawAllLayers');
        },
        // 获取所有可见图层
        getVisibleLayers() {
            return this.layers.filter(layer => layer.visible);
        }
    }
};
</script>

<style scoped>
.layer-manager {
    background: #f5f5f5;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.layer-controls {
    display: flex;
    gap: 8px;
    margin-bottom: 15px;
    flex-wrap: wrap;
}

button {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    background: #42b983;
    color: white;
    cursor: pointer;
    transition: background 0.3s;
}

button:disabled {
    background: #cccccc;
    cursor: not-allowed;
}

.layers-list {
    max-height: 300px;
    overflow-y: auto;
}

.layer-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: white;
    border-radius: 4px;
    margin-bottom: 6px;
    cursor: pointer;
    transition: background 0.2s;
}

.layer-item.active {
    background: #e3f2fd;
    border: 1px solid #2196f3;
}
</style>