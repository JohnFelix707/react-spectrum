import {Dialog as RACDialog, DialogProps as RACDialogProps, Provider, composeRenderProps, PopoverProps as AriaPopoverProps} from 'react-aria-components';
import {style} from '../style-macro/spectrum-theme' with {type: 'macro'};
import {ContentContext, FooterContext, HeaderContext, HeadingContext, ImageContext} from './Content';
import {ButtonGroupContext} from './ButtonGroup';
import {CloseButton} from './CloseButton';
import {useMediaQuery, useDOMRef} from '@react-spectrum/utils';
import {createContext, useContext, forwardRef, RefObject} from 'react';
import {Modal} from './Modal';
import {Popover} from './Popover';
import {DOMRef} from '@react-types/shared';
import {StyleProps} from './style-utils';

// TODO: what style overrides should be allowed?
export interface DialogProps extends Omit<RACDialogProps, 'className' | 'style'>, StyleProps {
  isDismissable?: boolean,
  size?: 'S' | 'M' | 'L'
}

const image = style({
  width: 'full',
  height: '[140px]',
  objectFit: 'cover'
});

const heading = style({
  flexGrow: 1,
  marginY: 0,
  fontSize: 'heading',
  lineHeight: 'heading',
  color: 'heading'
});

const header = style({
  fontSize: 'body-lg',
  color: 'body',
  lineHeight: 'body'
});

const content =  style({
  flexGrow: 1,
  overflowY: {
    default: 'auto',
    // Make the whole dialog scroll rather than only the content when the height it small.
    '@media (height < 400)': 'visible',
    type: {
      popover: 'visible'
    }
  },
  fontSize: 'body',
  lineHeight: 'body',
  color: 'body',
  // TODO: adjust margin on mobile?
  marginX: {
    default: 32,
    type: {
      popover: 8
    }
  }
});

const footer = style({
  flexGrow: 1,
  fontSize: 'body',
  lineHeight: 'body',
  color: 'body'
});

const buttonGroup = style({
  marginStart: 'auto',
  maxWidth: 'full'
});

interface DialogContextValue extends Pick<AriaPopoverProps, 'placement' | 'shouldFlip'> {
  type?: 'modal' | 'popover' | 'tray' | 'fullscreen' | 'fullscreenTakeover',
  isDismissable?: boolean,
  hideArrow?: boolean
}

export const DialogContext = createContext<DialogContextValue>({
  type: 'modal',
  isDismissable: false,
  hideArrow: false,
  shouldFlip: true
});

function Dialog(props: DialogProps, ref: DOMRef) {
  let ctx = useContext(DialogContext);
  let isDismissable = ctx.isDismissable || props.isDismissable;
  let domRef = useDOMRef(ref);

  switch (ctx.type) {
    case 'modal':
    case 'fullscreen':
    case 'fullscreenTakeover': {
      let size = ctx.type === 'modal' ? props.size : ctx.type;
      return (
        <Modal size={size} isDismissable={isDismissable}>
          <DialogInner {...props} {...ctx} dialogRef={domRef} isDismissable={isDismissable} />
        </Modal>
      );
    }
    case 'popover':
      // get hideArrow from dialog instead?
      return (
        <Popover hideArrow={ctx.hideArrow} placement={ctx.placement} shouldFlip={ctx.shouldFlip}>
          <DialogInner {...props} {...ctx} dialogRef={domRef} isDismissable={isDismissable} />
        </Popover>
      );

    // TODO: popover/tray
    // how do we want to do popover, v3 dialogtrigger rendered it, not the dialog
    // in addition, how do we want to handle the margins that dialog currently imposes, just change them to 0 for popover?
    // in order for the dialog to contain scrolling behavior, we'd need to follow what i did for menu otherwise the internal padding
    // of the popover will squish the scrollable content area and the scroll bar will appear to be inside instead of part of the popover
  }
}

let _Dialog = forwardRef(Dialog);
export {_Dialog as Dialog};

const dialogInner = style<DialogContextValue>({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  maxHeight: '[inherit]',
  boxSizing: 'border-box',
  outlineStyle: 'none',
  fontFamily: 'sans',
  borderRadius: {
    default: 'lg',
    type: {
      fullscreenTakeover: 'none'
    }
  },
  overflow: 'auto'
});

function DialogInner(props: DialogProps & DialogContextValue & {dialogRef: RefObject<HTMLElement>}) {
  // The button group in fullscreen dialogs usually goes at the top, but
  // when the window is small, it moves to the bottom. We could do this in
  // pure CSS with display: none, but then the ref would go to two places.
  // With JS we can actually unmount on of them to ensure there is only one at a time.
  // Hopefully apps don't SSR render a dialog that's already open, because this means
  // we don't evaluate the media query until JS loads.
  let isSmall = useMediaQuery('(max-width: 640px)');
  let buttonGroupPlacement = 'bottom';
  if (props.type === 'fullscreen' || props.type === 'fullscreenTakeover') {
    buttonGroupPlacement = isSmall ? 'bottom' : 'top';
  }

  if (props.isDismissable) {
    buttonGroupPlacement = 'none';
  }

  // TODO: manage focus when the button group placement changes and focus was on one of the buttons?

  return (
    <RACDialog
      {...props}
      ref={props.dialogRef}
      style={props.UNSAFE_style}
      className={(props.UNSAFE_className || '') + dialogInner({type: props.type})}>
      {composeRenderProps(props.children, (children, {close}) =>
          // Render the children multiple times inside the wrappers we need to implement the layout.
          // Each instance hides certain children so that they are all rendered in the correct locations.
          (<>
            {/* Hero image */}
            <Provider
              values={[
              [ImageContext, {className: image}],
              [HeadingContext, {hidden: true}],
              [HeaderContext, {hidden: true}],
              [ContentContext, {hidden: true}],
              [FooterContext, {hidden: true}],
              [ButtonGroupContext, {hidden: true}]
              ]}>
              {children}
            </Provider>
            {/* Top header: heading, header, dismiss button, and button group (in fullscreen dialogs). */}
            <div
              className={style({
              // Wrapper that creates the margin for the dismiss button.
                display: 'flex',
                alignItems: 'start',
                columnGap: 12,
                marginStart: {
                  default: 32,
                  type: {
                    popover: 8
                  }
                },
                marginEnd: {
                  default: 32,
                  isDismissable: 12,
                  type: {
                    popover: 8 // don't need to worry about dismissable case?
                  }
                },
                marginTop: {
                  default: 12,
                  type: {
                    popover: 8
                  }
                }
              })({isDismissable: props.isDismissable, type: props.type})}>
              <div
                className={style({
                // Wrapper for heading, header, and button group.
                // This swaps orientation from horizontal to vertical at small screen sizes.
                  display: 'flex',
                  flex: 1,
                  marginTop: {
                    default: 20, // 8 - 3 (handled above)?? moved to 32-12?
                    type: {
                      popover: 8
                    }
                  },
                  marginBottom: {
                    default: 16,
                    type: {
                      popover: 8
                    },
                    ':empty': 0
                  },
                  columnGap: 24,
                  rowGap: 8,
                  flexDirection: {
                    default: 'column',
                    sm: 'row'
                  },
                  alignItems: {
                    default: 'start',
                    sm: 'center'
                  }
                })({type: props.type})}>
                <Provider
                  values={[
                  [ImageContext, {hidden: true}],
                  [HeadingContext, {className: heading}],
                  [HeaderContext, {className: header}],
                  [ContentContext, {hidden: true}],
                  [FooterContext, {hidden: true}],
                  [ButtonGroupContext, {hidden: buttonGroupPlacement !== 'top'}]
                  ]}>
                  {children}
                </Provider>
              </div>
              {props.isDismissable &&
              <CloseButton onPress={close} css={style({marginBottom: 12})} />
            }
            </div>
            {/* Main content */}
            <Provider
              values={[
              [ImageContext, {hidden: true}],
              [HeadingContext, {hidden: true}],
              [HeaderContext, {hidden: true}],
              [ContentContext, {className: content({type: props.type})}],
              [FooterContext, {hidden: true}],
              [ButtonGroupContext, {hidden: true}]
              ]}>
              {children}
            </Provider>
            {/* Footer and button group */}
            <div
              className={style({
                display: 'flex',
                marginX: {
                  default: 32,
                  type: {
                    popover: 8
                  }
                },
                marginBottom: {
                  default: 32,
                  type: {
                    popover: 8
                  }
                },
                marginTop: {
                  default: 32,
                  ':empty': 0
                },
                gap: 24,
                alignItems: 'center',
                flexWrap: 'wrap'
              })({type: props.type})}>
              <Provider
                values={[
                [ImageContext, {hidden: true}],
                [HeadingContext, {hidden: true}],
                [HeaderContext, {hidden: true}],
                [ContentContext, {hidden: true}],
                [FooterContext, {className: footer}],
                [ButtonGroupContext, {hidden: buttonGroupPlacement !== 'bottom', css: buttonGroup, align: 'end'}]
                ]}>
                {children}
              </Provider>
            </div>
          </>)
        )}
    </RACDialog>
  );
}
