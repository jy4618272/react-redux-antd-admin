// 定义某个表渲染时的配置
// 如果不需要个性化, 可以不要这个文件, 所有配置项都会使用默认值
// 注意! config/dataSchema/querySchema文件的命名应该遵循CamelCase原则, 不要包含下划线/中划线

module.exports = [
    {
        showReceive: true,      // 显示确认收款按钮, 默认false
        showRefund: true,       // 显示确认退款按钮, 默认false
        showExportPage: true   // 显示导出本页按钮, 默认false
        // showExport: true        // 显示导出按钮, 默认false  
    },
    {
        showDoc: true,
        showExportPage: true   // 显示导出本页按钮, 默认false
        // showExport: true        // 显示导出按钮, 默认false  
    }
]