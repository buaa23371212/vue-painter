// src/console_logger/logger.js
const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal'
}

// 日志级别映射，用于判断日志是否需要输出
const LEVEL_PRIORITIES = {
  [LOG_LEVELS.DEBUG]: 0,
  [LOG_LEVELS.INFO]: 1,
  [LOG_LEVELS.WARN]: 2,
  [LOG_LEVELS.ERROR]: 3,
  [LOG_LEVELS.FATAL]: 4
}

// 默认日志级别
let currentLevel = LOG_LEVELS.DEBUG

/**
 * 设置日志输出级别
 * @param {string} level - 日志级别
 */
function setLevel(level) {
  if (LEVEL_PRIORITIES.hasOwnProperty(level)) {
    currentLevel = level
  } else {
    console.warn(`不支持的日志级别: ${level}，默认使用DEBUG级别`)
  }
}

/**
 * 格式化日志消息
 * @param {string} level - 日志级别
 * @param {any[]} args - 日志参数
 * @returns {string} 格式化后的日志消息
 */
function formatMessage(level, args) {
  const timestamp = new Date().toISOString()
  const levelStr = level.toUpperCase().padEnd(5)
  return `[${timestamp}] [${levelStr}] ${args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
  ).join(' ')}`
}

/**
 * 基础日志输出方法
 * @param {string} level - 日志级别
 * @param {any[]} args - 日志参数
 */
function log(level, ...args) {
  if (LEVEL_PRIORITIES[level] >= LEVEL_PRIORITIES[currentLevel]) {
    const message = formatMessage(level, args)
    switch (level) {
      case LOG_LEVELS.DEBUG:
        console.debug(message)
        break
      case LOG_LEVELS.INFO:
        console.info(message)
        break
      case LOG_LEVELS.WARN:
        console.warn(message)
        break
      case LOG_LEVELS.ERROR:
        console.error(message)
        break
      case LOG_LEVELS.FATAL:
        console.error(message)
        // 对于致命错误，可以在这里添加额外处理，如上报等
        break
      default:
        console.log(message)
    }
  }
}

// 导出各日志级别的方法
export const logger = {
  setLevel,
  debug: (...args) => log(LOG_LEVELS.DEBUG, ...args),
  info: (...args) => log(LOG_LEVELS.INFO, ...args),
  warn: (...args) => log(LOG_LEVELS.WARN, ...args),
  error: (...args) => log(LOG_LEVELS.ERROR, ...args),
  fatal: (...args) => log(LOG_LEVELS.FATAL, ...args)
}

export default logger