<template>
    <div class="layer-manager">
        <h3>图层管理</h3>
        
        <!-- 图层控制按钮区域 -->
        <div class="layer-controls">
            <!-- 添加新图层按钮 -->
            <button @click="addLayer">+ 新建图层</button>
            
            <!-- 删除当前图层按钮（至少保留一个图层） -->
            <button @click="deleteLayer" :disabled="layers.length <= 1">- 删除图层</button>
            
            <!-- 图层上移按钮（不能移动到最上层） -->
            <button @click="moveUp" :disabled="currentLayerIndex === layers.length - 1">↑ 上移</button>
            
            <!-- 图层下移按钮（不能移动到最下层） -->
            <button @click="moveDown" :disabled="currentLayerIndex === 0">↓ 下移</button>
        </div>
        
        <!-- 图层列表区域 -->
        <div class="layers-list">
            <!-- 循环渲染所有图层 -->
            <div v-for="(layer, index) in layers" :key="layer.id"
                :class="['layer-item', { 'active': index === currentLayerIndex }]" 
                @click="setCurrentLayer(index)">
                
                <!-- 图层可见性切换 -->
                <input type="checkbox" v-model="layer.visible" @change="onLayerVisibilityChange">
                
                <!-- 图层名称显示 -->
                <span>{{ layer.name }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';  // 用于生成唯一ID

/**
 * 图层管理组件
 * 功能：
 * 1. 管理多个绘图图层（添加/删除/排序）
 * 2. 控制图层的可见性和激活状态
 * 3. 处理图层画布的初始化和尺寸调整
 * 4. 提供图层操作接口给父组件
 */
export default {
    name: 'LayerManager',
    data() {
        return {
            // 图层数据数组
            layers: [
                // 默认背景层
                { 
                    id: uuidv4(), 
                    name: '背景层', 
                    visible: true, 
                    canvas: document.createElement('canvas') 
                }
            ],
            // 当前激活图层的索引
            currentLayerIndex: 0
        };
    },
    methods: {
        /**
         * 初始化所有图层画布
         * @param {number} containerWidth - 容器宽度
         * @param {number} containerHeight - 容器高度
         * @returns {HTMLCanvasElement} 当前激活图层的canvas元素
         */
        initLayerCanvases(containerWidth, containerHeight) {
            this.layers.forEach(layer => {
                const canvas = document.createElement('canvas');
                
                // 设置画布的实际像素尺寸
                canvas.width = containerWidth;
                canvas.height = containerHeight;
                
                // 设置CSS样式尺寸（确保显示尺寸与像素尺寸一致）
                canvas.style.width = `${containerWidth}px`;
                canvas.style.height = `${containerHeight}px`;
                
                // 避免canvas默认样式导致的布局偏差
                canvas.style.display = 'block';
                canvas.style.position = 'absolute';
                canvas.style.top = '0';
                canvas.style.left = '0';
                
                layer.canvas = canvas;
            });
            
            return this.layers[this.currentLayerIndex].canvas;
        },

        /**
         * 调整所有图层画布尺寸
         * @param {Object} size - 新尺寸 { width, height }
         */
        resizeAllCanvases(size) {
            this.layers.forEach(layer => {
                layer.canvas.width = size.width;
                layer.canvas.height = size.height;
            });
        },

        /**
         * 获取当前激活图层的画布
         * @returns {HTMLCanvasElement} 当前图层的canvas元素
         */
        getCurrentLayerCanvas() {
            return this.layers[this.currentLayerIndex].canvas;
        },

        /**
         * 添加新图层
         * 1. 创建新图层对象
         * 2. 初始化画布尺寸
         * 3. 设置为当前激活图层
         */
        addLayer() {
            // 使用第一个图层的尺寸作为参考
            const { width, height } = this.layers[0].canvas;
            
            const newLayer = {
                id: uuidv4(),
                name: `图层${this.layers.length}`,
                visible: true,
                canvas: document.createElement('canvas')
            };
            
            // 设置新画布尺寸
            newLayer.canvas.width = width;
            newLayer.canvas.height = height;
            
            // 添加到图层数组并激活
            this.layers.push(newLayer);
            this.currentLayerIndex = this.layers.length - 1;
            
            // 通知父组件图层变更
            this.$emit('layerChanged', this.getCurrentLayerCanvas());
        },

        /**
         * 删除当前图层
         * 1. 至少保留一个图层
         * 2. 删除后自动选择相邻图层
         */
        deleteLayer() {
            // 至少保留一个图层
            if (this.layers.length <= 1) return;
            
            // 移除当前图层
            this.layers.splice(this.currentLayerIndex, 1);
            
            // 调整当前激活索引（防止越界）
            this.currentLayerIndex = Math.min(
                this.currentLayerIndex,
                this.layers.length - 1
            );
            
            // 通知父组件图层变更
            this.$emit('layerChanged', this.getCurrentLayerCanvas());
        },

        /**
         * 设置当前激活图层
         * @param {number} index - 要激活的图层索引
         */
        setCurrentLayer(index) {
            this.currentLayerIndex = index;
            this.$emit('layerChanged', this.getCurrentLayerCanvas());
        },

        /**
         * 将当前图层上移一层
         * 1. 与上层交换位置
         * 2. 更新当前激活索引
         */
        moveUp() {
            // 已在最上层则不处理
            if (this.currentLayerIndex >= this.layers.length - 1) return;
            
            // 交换当前图层和上方图层的位置
            const upperIndex = this.currentLayerIndex + 1;
            [this.layers[this.currentLayerIndex], this.layers[upperIndex]] =
                [this.layers[upperIndex], this.layers[this.currentLayerIndex]];
            
            // 更新当前激活索引
            this.currentLayerIndex = upperIndex;
        },

        /**
         * 将当前图层下移一层
         * 1. 与下层交换位置
         * 2. 更新当前激活索引
         */
        moveDown() {
            // 已在最下层则不处理
            if (this.currentLayerIndex <= 0) return;
            
            // 交换当前图层和下方图层的位置
            const lowerIndex = this.currentLayerIndex - 1;
            [this.layers[this.currentLayerIndex], this.layers[lowerIndex]] =
                [this.layers[lowerIndex], this.layers[this.currentLayerIndex]];
            
            // 更新当前激活索引
            this.currentLayerIndex = lowerIndex;
        },

        /**
         * 处理图层可见性变化
         * 通知父组件需要重绘所有图层
         */
        onLayerVisibilityChange() {
            this.$emit('redrawAllLayers');
        },

        /**
         * 清空当前图层内容
         * 1. 获取当前图层画布
         * 2. 清除所有绘制内容
         * 3. 请求重绘
         */
        clearCurrentLayer() {
            const canvas = this.getCurrentLayerCanvas();
            const ctx = canvas.getContext('2d');
            
            // 清除整个画布
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 通知重绘
            this.$emit('redrawAllLayers');
        },

        /**
         * 获取所有可见图层
         * @returns {Array} 可见图层数组
         */
        getVisibleLayers() {
            return this.layers.filter(layer => layer.visible);
        }
    }
};
</script>

<style scoped>
/* 图层管理器容器样式 */
.layer-manager {
    background: #f5f5f5;               /* 浅灰色背景 */
    padding: 15px;                     /* 内边距 */
    border-radius: 8px;                 /* 圆角 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);  /* 柔和阴影 */
}

/* 控制按钮区域样式 */
.layer-controls {
    display: flex;          /* 弹性布局 */
    gap: 8px;               /* 按钮间距 */
    margin-bottom: 15px;    /* 底部外边距 */
    flex-wrap: wrap;        /* 允许换行 */
}

/* 按钮基础样式 */
button {
    padding: 6px 12px;      /* 内边距 */
    border: none;           /* 无边框 */
    border-radius: 4px;     /* 圆角 */
    background: #42b983;    /* 主题绿色 */
    color: white;           /* 白色文字 */
    cursor: pointer;        /* 手型光标 */
    transition: background 0.3s;  /* 背景色过渡效果 */
}

/* 禁用状态按钮样式 */
button:disabled {
    background: #cccccc;    /* 灰色背景 */
    cursor: not-allowed;    /* 禁用光标 */
}

/* 图层列表容器样式 */
.layers-list {
    max-height: 300px;      /* 最大高度 */
    overflow-y: auto;       /* 垂直滚动 */
}

/* 单个图层项样式 */
.layer-item {
    display: flex;          /* 弹性布局 */
    align-items: center;    /* 垂直居中 */
    gap: 8px;               /* 元素间距 */
    padding: 8px 12px;      /* 内边距 */
    background: white;      /* 白色背景 */
    border-radius: 4px;     /* 圆角 */
    margin-bottom: 6px;     /* 底部外边距 */
    cursor: pointer;        /* 手型光标 */
    transition: background 0.2s;  /* 背景色过渡 */
}

/* 激活状态的图层样式 */
.layer-item.active {
    background: #e3f2fd;   /* 浅蓝色背景 */
    border: 1px solid #2196f3;  /* 蓝色边框 */
}
</style>