<template>
  <div class="canvas-wrapper">
    <!-- 主画布组件 -->
    <!-- 
      - 负责实际绘图渲染
      - 接收绘图工具参数（颜色/笔刷/工具类型）
      - 监听图层变化和画布尺寸变化
    -->
    <MainCanvas 
      ref="mainCanvas" 
      :currentColor="currentColor" 
      :brushSize="brushSize" 
      :currentTool="currentTool"
      :currentLayerCanvas="currentLayerCanvas" 
      @request-redraw="redrawAllLayers" 
      @resize="handleCanvasResize" 
    />

    <!-- 图层管理组件 -->
    <!-- 
      - 独立管理所有图层状态
      - 处理图层添加/删除/顺序变更
      - 触发图层更新事件
    -->
    <LayerManager 
      ref="layerManager" 
      @layerChanged="handleLayerChanged" 
      @redrawAllLayers="redrawAllLayers" 
    />
  </div>
</template>

<script>
import LayerManager from './LayerManager.vue';
import MainCanvas from './MainCanvas.vue';

/**
 * 画布容器组件
 * 功能：
 * 1. 整合绘图画布和图层管理功能
 * 2. 协调主画布与图层间的数据流
 * 3. 处理画布尺寸变化响应
 */
export default {
  name: 'CanvasContainer',
  components: {
    LayerManager,
    MainCanvas
  },
  // 接收父组件传递的绘图工具参数
  props: {
    currentColor: String,   // 当前选择的绘图颜色
    brushSize: Number,      // 当前笔刷尺寸
    currentTool: String     // 当前激活的工具类型（画笔/橡皮等）
  },
  data() {
    return {
      currentLayerCanvas: null  // 当前激活图层的Canvas引用
    };
  },
  mounted() {
    /**
     * 组件挂载后初始化图层系统
     * 1. 从主画布获取初始尺寸
     * 2. 初始化图层管理器
     * 3. 设置当前默认图层
     */
    this.currentLayerCanvas = this.$refs.layerManager.initLayerCanvases(
      this.$refs.mainCanvas.getCanvasSize()
    );
  },
  methods: {
    /**
     * 响应画布尺寸变化事件
     * @param {Object} size - 新的画布尺寸 { width, height }
     */
    handleCanvasResize(size) {
      this.$refs.layerManager.resizeAllCanvases(size);
    },

    /**
     * 处理当前图层变更事件
     * @param {HTMLCanvasElement} canvas - 新激活图层的Canvas元素
     */
    handleLayerChanged(canvas) {
      this.currentLayerCanvas = canvas;
      this.redrawAllLayers();
    },

    /** 重绘所有可见图层到主画布 */
    redrawAllLayers() {
      const visibleLayers = this.$refs.layerManager.getVisibleLayers();
      this.$refs.mainCanvas.redraw(visibleLayers);
    },

    /** 清空当前图层内容 */
    clearCanvas() {
      this.$refs.layerManager.clearCurrentLayer();
    }
  },
  beforeDestroy() {
    // 组件销毁前移除事件监听
    this.$refs.mainCanvas.$off('resize', this.handleCanvasResize);
  }
};
</script>

<style scoped>
/* 主容器布局 */
.canvas-wrapper {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  height: 100vh; /* 占满整个视口高度 */
}

/* 响应式布局：小屏幕时改为纵向排列 */
@media (max-width: 768px) {
  .canvas-wrapper {
    flex-direction: column;
  }

  /* 图层管理器在移动端的最大高度 */
  .layer-manager {
    max-height: 40vh;  /* 限制最大高度 */
    overflow-y: auto;   /* 内容超出时显示滚动条 */
  }
}
</style>