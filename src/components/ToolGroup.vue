<template>
  <div class="tool-group">
    <button class="tool-btn" :class="{ active: currentTool === 'pencil' }"
      @click="handleToolChange('pencil')">
      <span>✏️</span> 画笔
    </button>
    <button class="tool-btn" :disabled="true" @click="handleToolChange('eraser')">
      <span>🧹</span> 橡皮擦
    </button>
    <button class="tool-btn" :disabled="true" @click="handleToolChange('shape')">
      <span>⭕</span> 形状
    </button>
    <button class="tool-btn" :disabled="true" @click="handleToolChange('text')">
      <span>🅰️</span> 文字
    </button>
  </div>
</template>

<script>
export default {
  name: 'ToolGroup',
  props: {
    currentTool: {
      type: String,
      required: true,
      default: 'pencil'
    }
  },
  methods: {
    handleToolChange(tool) {
      this.$emit('tool-change', tool)
    }
  }
}
</script>

<style scoped>
.tool-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  /* 浅色方框样式 */
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  background-color: #fafafa;
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

@media (max-width: 768px) {
  .tool-group {
    justify-content: center;
  }
}
</style>