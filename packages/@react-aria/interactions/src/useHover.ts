import {DOMProps} from '@react-types/shared';
import {HoverResponderContext} from './hoverContext';
import {HTMLAttributes, RefObject, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {mergeProps} from '@react-aria/utils';

export interface HoverEvent {
  type: 'hoverstart' | 'hoverend' | 'hovering',
  target: HTMLElement
}

export interface HoverProps {
  isHovering?: boolean,
  onHover?: (e: HoverEvent) => void,
  onHoverStart?: (e:HoverEvent) => void,
  onHoverEnd?: (e: HoverEvent) => void,
  onHoverChange?: (isHovering: boolean) => void
}

export interface HoverHookProps extends HoverProps, DOMProps {
  ref?: RefObject<HTMLElement>
}

interface HoverState {
  isHovering: boolean,
  target: HTMLElement | null
}

function useHoverResponderContext(props: HoverHookProps): HoverHookProps {
  // Consume context from <HoverResponder> and merge with props.
  let context = useContext(HoverResponderContext);
  if (context) {
    let {register, ...contextProps} = context;
    props = mergeProps(contextProps, props) as HoverHookProps;
    register();
  }

  // Sync ref from <HoverResponder> with ref passed to useHover.
  useEffect(() => {
    if (context && context.ref) {
      context.ref.current = props.ref.current;
      return () => {
        context.ref.current = null;
      };
    }
  }, [context, props.ref]);

  return props;
}

interface HoverResult {
  isHovering: boolean,
  hoverProps: HTMLAttributes<HTMLElement>
}

export function useHover(props: HoverHookProps): HoverResult {
  let {
    onHover,
    onHoverChange,
    onHoverStart,
    onHoverEnd,
    isHovering: isHoveringProp,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ref: _, // Removing `ref` from `domProps` because TypeScript is dumb
    ...domProps
  } = useHoverResponderContext(props);

  let [isHovering, setHover] = useState(false);
  let ref = useRef<HoverState>({
    isHovering: false,
    target: null
  });


  let hoverProps = useMemo(() => {

    let state = ref.current;

    let triggerHoverStart = (target) => {

      if (onHoverStart) {
        onHoverStart({
          type: 'hoverstart',
          target
        });
      }

      if (onHoverChange) {
        onHoverChange(true);
      }

      setHover(true);
    };

    let triggerHoverEnd = (target, wasHovered = true) => {

      if (onHoverEnd) {
        onHoverEnd({
          type: 'hoverend',
          target
        });
      }

      if (onHoverChange) {
        onHoverChange(false);
      }

      setHover(false);

      if (onHover && wasHovered) {
        onHover({
          type: 'hovering',
          target
        });
      }
    };

    let hoverProps: HTMLAttributes<HTMLElement> = {
      onMouseEnter(e) {
        if (!state.isHovering) {
          state.isHovering = true;
          triggerHoverStart(e.target);
        }
      },
      onMouseLeave(e) {
        if (state.isHovering) {
          state.isHovering = false;
          triggerHoverEnd(e.target);
        }
      }
    };

    hoverProps.onMouseEnter = (e) => {
      state.target = e.currentTarget;
      state.isHovering = true;
      triggerHoverStart(e.target);
    };

    hoverProps.onMouseLeave = (e) => {
      state.isHovering = false;
      triggerHoverEnd(e.target);
    };

    return hoverProps;
  }, [onHover, onHoverStart, onHoverEnd, onHoverChange]);


  return {
    isHovering: isHoveringProp || isHovering,
    hoverProps: mergeProps(domProps, hoverProps)
  };

}
