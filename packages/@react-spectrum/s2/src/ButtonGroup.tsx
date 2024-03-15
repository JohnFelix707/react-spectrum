import {Provider, SlotProps, useContextProps} from 'react-aria-components';
import {style} from '../style-macro/spectrum-theme' with {type: 'macro'};
import {ReactNode, useRef, useCallback, forwardRef, createContext} from 'react';
import {useLayoutEffect, useValueEffect} from '@react-aria/utils';
import {
  useDOMRef,
  useResizeObserver
} from '@react-spectrum/utils';
import {ContextValue} from './Content';
import {DOMProps, DOMRef} from '@react-types/shared';
import {StyleProps, getAllowedOverrides} from './style-utils' with {type: 'macro'};
import {ButtonContext} from './Button';

interface ButtonGroupStyleProps {
  /**
   * The axis the ButtonGroup should align with. Setting this to 'vertical' will prevent
   * any switching behaviors between 'vertical' and 'horizontal'.
   *
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical',
  /**
   * The alignment of the Buttons within the ButtonGroup.
   *
   * @default 'start'
   */
  align?: 'start' | 'end' | 'center',
  /**
   * The size of the Buttons within the ButtonGroup.
   *
   * @default "M"
   */
  size?: 'S' | 'M' | 'L' | 'XL'
}

interface ButtonGroupProps extends ButtonGroupStyleProps, SlotProps, StyleProps, DOMProps {
  /** The Buttons contained within the ButtonGroup. */
  children: ReactNode,
  /** Whether the Buttons in the ButtonGroup are all disabled. */
  isDisabled?: boolean
}

interface ButtonGroupContextValue extends Omit<ButtonGroupProps, 'children'> {
  /** Whether the ButtonGroup shouldn't be rendered. */
  hidden?: boolean
}

export const ButtonGroupContext = createContext<ContextValue<ButtonGroupContextValue, HTMLDivElement>>({});

const buttongroup = style<ButtonGroupStyleProps>({
  display: 'inline-flex',
  position: 'relative',
  gap: {
    size: {
      S: 8,
      M: 12,
      L: 12,
      XL: 12
    }
  },
  flexDirection: {
    default: 'row',
    orientation: {
      vertical: 'column'
    }
  },
  alignItems: {
    default: 'center',
    orientation: {
      vertical: {
        default: 'start',
        align: {
          end: 'end',
          center: 'center'
        }
      }
    }
  },
  justifyContent: {
    orientation: {
      vertical: {
        default: 'start',
        align: {
          end: 'end',
          center: 'center'
        }
      }
    }
  }
}, getAllowedOverrides());

function ButtonGroup(props: ButtonGroupProps, ref: DOMRef<HTMLDivElement>) {
  let domRef = useDOMRef(ref);
  [props, domRef] = useContextProps(props, domRef, ButtonGroupContext);
  let {
    size = 'M',
    orientation = 'horizontal',
    align = 'start',
    children,
    isDisabled
  } = props;

  let [hasOverflow, setHasOverflow] = useValueEffect(false);

  let checkForOverflow = useCallback(() => {
    let computeHasOverflow = () => {
      if (domRef.current && orientation === 'horizontal') {
        let buttonGroupChildren = Array.from(domRef.current.children) as HTMLElement[];
        let maxX = domRef.current.offsetWidth + 1; // + 1 to account for rounding errors
        // If any buttons have negative X positions (align="end") or extend beyond
        // the width of the button group (align="start"), then switch to vertical.
        if (buttonGroupChildren.some(child => child.offsetLeft < 0 || child.offsetLeft + child.offsetWidth > maxX)) {
          return true;
        }
        return false;
      }
    };
    if (orientation === 'horizontal') {
      setHasOverflow(function* () {
        // Force to horizontal for measurement.
        yield false;

        // Measure, and update if there is overflow.
        yield computeHasOverflow();
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domRef, orientation, setHasOverflow, children]);

  // There are two main reasons we need to remeasure:
  // 1. Internal changes: Check for initial overflow or when orientation/scale/children change (from checkForOverflow dep array)
  useLayoutEffect(() => {
    checkForOverflow();
  }, [checkForOverflow]);

  // 2. External changes: buttongroup won't change size due to any parents changing size, so listen to its container for size changes to figure out if we should remeasure
  let parent = useRef<HTMLElement>();
  useLayoutEffect(() => {
    if (domRef.current) {
      parent.current = domRef.current.parentElement as HTMLElement;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domRef.current]);
  useResizeObserver({ref: parent, onResize: checkForOverflow});

  if ((props as ButtonGroupContextValue).hidden) {
    return null;
  }
  return (
    <div
      ref={domRef}
      style={props.UNSAFE_style}
      className={(props.UNSAFE_className || '') + buttongroup({
        align,
        orientation: orientation === 'vertical' || hasOverflow ? 'vertical' : 'horizontal',
        size
      }, props.css)}>
      <Provider
        values={[
          [ButtonContext, {css: style({flexShrink: 0}), size, isDisabled}]
        ]}>
        {children}
      </Provider>
    </div>
  );
}

/**
 * ButtonGroup handles overflow for a grouping of buttons whose actions are related to each other.
 */
const _ButtonGroup = forwardRef(ButtonGroup);
export {_ButtonGroup as ButtonGroup};
