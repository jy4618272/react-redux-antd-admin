// ================================
// Action Type
// ================================
const SLIDEBAR_TOGGLE = 'SLIDEBAR_TOGGLE'

// ================================
// Action Creator
// ================================
const slideBarToggle = () => ({
    type: SLIDEBAR_TOGGLE
})

/* default 导出所有 Actions Creator */
export default {
    slideBarToggle
}

// ================================
// Action handlers for Reducer
// 本来更新 state 是 Reducer 的责任
// 但要把 ActionType 导出又引入实在太麻烦
// 且在 Reducer 中写 switch-case 实在太不优雅
// 故在此直接给出处理逻辑
// ================================
export const ACTION_HANDLERS = {
    [SLIDEBAR_TOGGLE]: (layout) => ({ ...layout, slideBar: !layout.slideBar })
}
