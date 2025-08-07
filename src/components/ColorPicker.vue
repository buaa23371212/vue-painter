<template>
  <div class="color-picker">
    <div 
      class="color-option" 
      :class="{ active: currentColor === color }" 
      :style="{ background: color }"
      :data-color="color" 
      @click="handleColorChange(color)" 
      v-for="color in colorOptions" 
      :key="color"
    >
    </div>
  </div>
</template>

<script>
export default {
  name: 'ColorPicker',
  props: {
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
    handleColorChange(color) {
      this.$emit('color-change', color)
    }
  }
}
</script>

<style scoped>
.color-picker {
  display: flex;
  align-items: center;
  gap: 10px;
  /* 浅色方框样式 */
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  background-color: #fafafa;
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

@media (max-width: 768px) {
  .color-picker {
    justify-content: center;
  }
}
</style>