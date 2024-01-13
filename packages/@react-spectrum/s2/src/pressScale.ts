import {CSSProperties, RefObject} from 'react';

export function pressScale(ref: RefObject<HTMLElement>, style?: CSSProperties) {
  return ({isPressed}: {isPressed: boolean}) => {
    if (isPressed && ref.current) {
      let {width = 0, height = 0} = ref.current.getBoundingClientRect() ?? {};
      // TODO: combine with existing transform? but not with existing style attribute...
      // let transform = window.getComputedStyle(ref.current).transform;
      // if (transform === 'none') {
      //   transform = '';
      // }
      return {
        ...style,
        willChange: `${style?.willChange ?? ''} transform`,
        transform: `perspective(${Math.max(height, width / 3)}px) translate3d(0, 0, -2px)`
      };
    } else {
      return {
        ...style,
        willChange: `${style?.willChange ?? ''} transform`
      };
    }
  };
}
