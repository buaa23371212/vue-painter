// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import WelcomePage from '@/pages/welcomepage.vue'  // 使用别名 @ 指向 src 目录
import DrawingBoardPage from '@/pages/DrawingBoardPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),  // 使用 HTML5 history 模式
  routes: [
    {
      path: '/',  // 根路径（应用入口）
      name: 'welcome',
      component: WelcomePage  // 关联 WelcomePage 组件
    },
    {
      path: '/drawing-board',
      name: 'drawing-board',
      component: DrawingBoardPage
    }
  ]
})

export default router