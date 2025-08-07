<template>
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
</template>

<style scoped>
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
</style>