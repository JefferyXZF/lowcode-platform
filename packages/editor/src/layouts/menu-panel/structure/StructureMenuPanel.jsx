import {designComponent, reactive} from "plain-ui-composition";
import './StructureMenuPanel.scss';
import {PlIcon} from "plain-ui";
import {VisualEditorProvider} from "../../../packages/utils/VisualEditorProvider";

/**
 * 菜单面板页面结构
 * @author  韦胜健
 * @date    2022/1/23 21:06
 */
const Structure = designComponent({
  props: {
    data: { type: Object, required: true },
    level: { type: Number, default: 0 },
    expandState: { type: Object, required: true },
  },
  setup({ props }) {

    const editor = VisualEditorProvider.inject();

    const utils = {
      /**
       * 当前是否已经展开
       * @author  韦胜健
       * @date    2022/1/24 9:33
       */
      getExpand: () => {
        const id = props.data?.id;
        if (!id) {return false;}
        const val = props.expandState[id];
        return val == null ? true : val;
      },
      /**
       * 设置当前节点的展开状态
       * @author  韦胜健
       * @date    2022/1/24 9:34
       */
      setExpand: (val) => {
        const id = props.data?.id;
        if (!id) {return;}
        /*vue2 得用 set赋值*/
        props.expandState[id] = val;
      },
      /**
       * 切换节点的展开状态
       * @author  韦胜健
       * @date    2022/1/24 9:34
       */
      toggleExpand: () => {
        const id = props.data?.id;
        if (!id) {return;}
        utils.setExpand(!utils.getExpand());
      },
      /**
       * 设置当前节点为获取焦点状态
       * @author  韦胜健
       * @date    2022/1/24 9:34
       */
      focus: () => {
        if (!props.data) {return;}
        editor.methods.setFocus(props.data);
        editor.methods.scrollToData(props.data);
      },
    };

    const renderContent = (name, content) => (
      <>
        <div
          class="cms-visual-editor-menu-structure-name"
          {...(() => {
            const ret = {};
            ret.style = { paddingLeft: `${props.level * 16 + 8}px` };
            if (editor.methods.isFocus(props.data)) {
              ret['data-active'] = "1";
            }
            return ret;
          })()}
        >
          <div onClick={utils.toggleExpand}>
            <PlIcon
              class="cms-visual-editor-menu-structure-expander"
              icon={utils.getExpand() ? 'el-icon-arrow-down' : 'el-icon-arrow-right'}
              style={{ opacity: !props.data || !props.data.childrenData || props.data.childrenData.length === 0 ? '0' : '' }}
            />
          </div>
          <div onClick={utils.focus}>
            <PlIcon icon={!!props.data && !!props.data.childrenData && props.data.childrenData.length > 0 ? 'el-icon-folder-opened' : 'el-icon-document'}/>
            <span>{name || '未知名组件'}</span>
          </div>
        </div>
        {content}
      </>
    );

    return () => {
      if (!props.data) {
        return renderContent('无内容');
      }

      const component = editor.components.config.getComponentConfig(props.data);

      return renderContent(component?.name, (
        !!props.data.childrenData && utils.getExpand() && props.data.childrenData.map((item, index) => (
          <Structure key={index} data={item} level={props.level + 1} expandState={props.expandState}/>
        ))
      ));
    };
  },
});

/**
 * 菜单面板：所有组件
 * @author  韦胜健
 * @date    2022/1/23 13:35
 */
export function useVisualEditorMenuPanelStructure({ registryPanel, methods, currentPage }) {

  const state = reactive({
    isExpand: {},
  });

  const utils = {
    expandAll: () => {
      methods.iterateComponentData((data) => {
        state.isExpand[data.id] = true;
      });
    },
    collapseAll: () => {
      methods.iterateComponentData((data) => {
        state.isExpand[data.id] = false;
      });
    },
  };

  registryPanel({
    title: '页面结构',
    name: 'structure',
    render: () => <div class="cms-visual-editor-menu-structure">
      <div class="cms-visual-editor-panel-title">
        <div>页面结构</div>
        <div>
          <div onClick={utils.expandAll}>展开</div>
          <div onClick={utils.collapseAll}>收起</div>
        </div>
      </div>
      {!!currentPage.value && currentPage.value.childrenData.map((item, index) => (
        <Structure key={index} data={item} expandState={state.isExpand}/>
      ))}
    </div>
  });
  return {};
}
