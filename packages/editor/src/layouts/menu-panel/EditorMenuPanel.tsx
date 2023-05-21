import './EditorMenuPanel.scss'
import { ref, defineComponent, reactive } from 'vue'
import { RenderNode, iVisualEditorCommon } from '@lowcode-editor/types/editorMenuType.ts'

interface iMenuPanel {
  name: string
  render: () => RenderNode
}

/**
 * 编辑器菜单面板
 */
export function editorMenuPanelBase() {
  const state = reactive({
    panels: [] as iMenuPanel[],
    activeIndex: 0
  })

  const registry = (panel: iMenuPanel) => {
    state.panels.push(panel)
  }

  const renderSidebar = () => {
    return (
      <div class="cms-visual-editor-panel-side-bar cms-visual-editor-menu-side-bar">
        {state.panels.map((panel, index) => (
          <div
            {...(() => {
              const attrs: any = {}
              if (index == state.activeIndex) {
                attrs['data-active'] = true
              }
              return attrs
            })()}
            onClick={() => (state.activeIndex = index)}
          >
            {panel.name}
          </div>
        ))}
      </div>
    )
  }

  const renderMenuContent = () => {
    if (!state.panels[state.activeIndex]) {
      return null
    }
    return state.panels[state.activeIndex].render()
  }

  return {
    menuState: state,
    addMenuPanel: registry,
    renderMenuSidebar: renderSidebar,
    renderMenuContent: renderMenuContent
  }
}

/**
 * 菜单面板内容管理组合函数
 */
export function useEditorMenuPanel(editor: iVisualEditorCommon) {
  /*面板管理*/
  const menuBase = editorMenuPanelBase()
  /*所有组件面板*/
  const components = useEditorMenuPanelComponents({ menuBase, ...editor })
  /*页面结构面板*/
  const structure = useEditorMenuPanelStructure({ menuBase, ...editor })
  /*操作历史面板*/
  const history = useEditorMenuPanelHistory({ menuBase, ...editor })

  return { menuBase, components, structure, history }
}
