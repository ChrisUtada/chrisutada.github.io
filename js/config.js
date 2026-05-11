/**
 * T.E.C-OS 配置常量
 * 游戏全局配置和常量定义
 */

export const CONFIG = {
    VERSION: 'v4.11.0',
    SAVE_KEY: 'causal_os_save',

    // 颜色配置
    COLORS: {
        GREEN: '#0066cc',
        DARK: '#808080',
        WARN: '#cc6600',
        CRIT: '#cc3333',
        TRUENAME: '#9966cc',
        BG: '#e0e0e0',
        CHAR: '#0066cc',
        ITEM: '#669933',
        LOC: '#9966cc',
        CYAN: '#0066cc',
        PINK: '#cc6699'
    },

    // 动画延迟配置（毫秒）
    DELAYS: {
        STORY_LINE: 1500,
        CAPTURE_ACTIONS: 6000,
        TRUENAME_BLOCK: 800,
        GLITCH_NOTICE: 400
    },

    // 日志配置
    LOG: {
        BUFFER_FLUSH_INTERVAL: 50,
        MAX_BUFFER_SIZE: 500,
        SAVE_LOG_DEBOUNCE: 2000
    },

    // 菜单配置
    MENU: {
        ESTIMATED_WIDTH: 160,
        ESTIMATED_HEIGHT: 120,
        BOUNDARY_PADDING: 10
    },

    // 编辑器同步配置
    EDITOR_SYNC: {
        SYNC_KEY: 'causal_os_editor_data',
        SYNC_TIMESTAMP_KEY: 'causal_os_editor_timestamp',
        CHANNEL_NAME: 'causal_os_sync',
        EXPIRE_TIME: 3600000 // 1小时
    }
};

export default CONFIG;
