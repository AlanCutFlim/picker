import * as React from 'react';
import classNames from 'classnames';
import KeyCode from 'rc-util/lib/KeyCode';
import DatePanel, { DatePanelProps } from '../DatePanel';
import TimePanel, { TimePanelProps } from '../TimePanel';
import { tuple } from '../../utils/stringUtil';
import { PanelRefProps } from '../../interface';

export type DatetimePanelProps<DateType> = DatePanelProps<DateType> &
  TimePanelProps<DateType>;

const ACTIVE_PANEL = tuple('date', 'time');
type ActivePanelType = typeof ACTIVE_PANEL[number];

function DatetimePanel<DateType>(props: DatetimePanelProps<DateType>) {
  const { prefixCls, operationRef } = props;
  const panelPrefixCls = `${prefixCls}-datetime-panel`;
  const [activePanel, setActivePanel] = React.useState<ActivePanelType | null>(
    null,
  );

  const dateOperationRef = React.useRef<PanelRefProps>({});
  const timeOperationRef = React.useRef<PanelRefProps>({});

  // ======================= Keyboard =======================
  function getNextActive(offset: number) {
    const activeIndex = ACTIVE_PANEL.indexOf(activePanel!) + offset;
    const nextActivePanel = ACTIVE_PANEL[activeIndex] || null;
    return nextActivePanel;
  }

  operationRef.current = {
    onKeyDown: event => {
      if (event.which === KeyCode.TAB) {
        const nextActivePanel = getNextActive(event.shiftKey ? -1 : 1);
        setActivePanel(nextActivePanel);

        if (nextActivePanel) {
          event.preventDefault();
        }
      } else if (activePanel) {
        const ref =
          activePanel === 'date' ? dateOperationRef : timeOperationRef;

        if (ref.current && ref.current.onKeyDown) {
          ref.current.onKeyDown(event);
        }
      }
    },
    onBlur: e => {
      if (timeOperationRef.current.onBlur) {
        timeOperationRef.current.onBlur(e);
      }
      setActivePanel(null);
    },
  };

  return (
    <div
      className={classNames(panelPrefixCls, {
        [`${panelPrefixCls}-active`]: activePanel,
      })}
    >
      <DatePanel
        {...props}
        operationRef={dateOperationRef}
        active={activePanel === 'date'}
      />
      <TimePanel
        {...props}
        operationRef={timeOperationRef}
        active={activePanel === 'time'}
      />
    </div>
  );
}

export default DatetimePanel;