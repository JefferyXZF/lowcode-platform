import { ref, defineComponent, reactive } from 'vue'

/**
 * 菜单面板：所有组件
 * @author  韦胜健
 * @date    2022/1/23 13:35
 */
export const useEditorMenuPanelComponents = ({ registryPanel, hooks, methods, components }) => {
  const searchState = reactive({
    text: ''
  })

  const { onMousedown, onDragstart, onDragend } = useVisualEditorMenuDraggier({ hooks, methods })

  const groups = computed(() => {
    if (!searchState.text) {
      return components.config.state.groups
    }
    const groups = []
    components.config.state.groups.forEach((group) => {
      if (group.title.indexOf(searchState.text) > -1) {
        groups.push(group)
      } else {
        const matchChildren = group.children.filter(
          (child) => child.name.indexOf(searchState.text) > -1
        )
        if (matchChildren.length > 0) {
          groups.push({
            ...group,
            children: matchChildren
          })
        }
      }
    })
    // console.log('groups', groups)
    return groups
  })

  registryPanel({
    title: '所有组件',
    name: 'element',
    render: () => (
      <>
        <div class="cms-visual-editor-menu-search">
          <PlInputGroup block>
            <PlInput placeholder="关键词搜索组件" fillGroup clearIcon v-model={searchState.text} />
            <PlButton icon="el-icon-search" />
          </PlInputGroup>
        </div>
        {groups.value
          .filter((i) => i.children.length > 0)
          .map((group) => (
            <ul key={group.title} class="cms-visual-editor-menu-group">
              <li class="cms-visual-editor-menu-group-name cms-visual-editor-side-panel-title">
                <PlIcon icon="el-icon-arrow-down" />
                <span>{group.title}</span>
              </li>
              <li>
                <div class="cms-visual-editor-menu-list">
                  {group.children.map((child) => (
                    <div
                      class="cms-visual-editor-menu-item"
                      draggable="true"
                      data-component-name={child.name}
                      onDragstart={(e) => onDragstart({ event: e, component: child })}
                      onDragend={(e) => onDragend({ event: e, component: child })}
                    >
                      {/* <div class="cms-visual-editor-menu-item" key={child.name} onMousedown={(e) => onMousedown({ event: e, component: child })}> */}
                      <div class="cms-visual-editor-menu-preview-wrapper">
                        <div class="cms-visual-editor-menu-preview-inner">
                          {child.previewImage ? (
                            <img
                              draggable="false"
                              class="cms-visual-editor-menu-preview-image"
                              src={child.previewImage}
                            />
                          ) : (
                            child.preview && child.preview()
                          )}
                        </div>
                      </div>
                      <div class="cms-visual-editor-menu-item-name">{child.name}</div>
                      {child.isCombine && (
                        <div
                          class="cms-visual-editor-menu-item-remove-btn"
                          onClick={() => components.combine.remove(child)}
                        >
                          <PlIcon icon="el-icon-close" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </li>
            </ul>
          ))}
      </>
    )
  })
  return {}
}
