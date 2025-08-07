<template>
  <div class="shape-picker">
    <button 
      class="shape-btn" 
      :class="{ active: currentShape === shape.value }"
      @click="handleShapeChange(shape.value)"
      v-for="shape in shapeOptions" 
      :key="shape.value"
    >
      <span>{{ shape.icon }}</span> {{ shape.label }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'ShapePicker',
  props: {
    currentShape: {
      type: String,
      required: true,
      default: 'line'
    }
  },
  data() {
    return {
      shapeOptions: [
        { value: 'line', label: '直线', icon: '📏' },
        { value: 'rectangle', label: '矩形', icon: '□' },
        { value: 'circle', label: '圆形', icon: '○' },
        { value: 'triangle', label: '三角形', icon: '△' }
      ]
    }
  },
  methods: {
    handleShapeChange(shape) {
      this.$emit('shape-change', shape)
    }
  }
}
</script>

<style scoped>
.shape-picker {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  background-color: #fafafa;
}

.shape-btn {
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

.shape-btn:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
}

.shape-btn.active {
  background: #3498db;
  color: white;
  border-color: #2980b9;
}

.shape-btn span {
  font-size: 18px;
}

@media (max-width: 768px) {
  .shape-picker {
    justify-content: center;
  }
}
</style>