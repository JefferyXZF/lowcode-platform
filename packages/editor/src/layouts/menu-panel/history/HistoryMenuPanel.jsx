import './HistoryMenuPanel.scss';

/**
 * 菜单面板：操作历史
 * @author  韦胜健
 * @date    2022/1/23 13:35
 */
export function useVisualEditorMenuPanelHistory({ registryPanel, history }) {
  registryPanel({
    title: '操作历史',
    name: 'history',
    render: () => (
      <div class="cms-visual-editor-history-panel">
        <div class="cms-visual-editor-panel-title">
          <div>操作历史</div>
          <div>
            <div onClick={history.undo}>撤销</div>
            <div onClick={history.redo}>重做</div>
          </div>
        </div>
        {history.state.data.map((item, index) => (
          <div key={index} class="cms-visual-editor-history-item" data-active={index === history.state.current} onClick={() => history.applyCache(index)}>
            <span class="cms-visual-editor-history-item-name">{item.msg}</span>
            <span class="cms-visual-editor-history-item-time">{item.time}</span>
          </div>
        ))}
        {history.state.data.length === 0 && (
          <div class="cms-visual-editor-history-empty">
            暂无操作历史
          </div>
        )}
      </div>
    )
  });
  return {};
}
