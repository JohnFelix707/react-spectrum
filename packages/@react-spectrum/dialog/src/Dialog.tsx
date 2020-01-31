import {ActionButton} from '@react-spectrum/button';
import {classNames, filterDOMProps, useStyleProps} from '@react-spectrum/utils';
import CrossLarge from '@spectrum-icons/ui/CrossLarge';
import {DialogContext, DialogContextValue} from './context';
import {FocusScope} from '@react-aria/focus';
import {Grid} from '@react-spectrum/layout';
import {mergeProps} from '@react-aria/utils';
import React, {useContext, useRef} from 'react';
import {SpectrumBaseDialogProps, SpectrumDialogProps} from '@react-types/dialog';
import styles from '@adobe/spectrum-css-temp/components/dialog/vars.css';
import {useDialog, useModalDialog} from '@react-aria/dialog';

export function Dialog(props: SpectrumDialogProps) {
  let {
    type = 'popover',
    ...contextProps
  } = useContext(DialogContext) || {} as DialogContextValue;
  let {
    children,
    isDismissable,
    ...otherProps
  } = props;
  let {styleProps} = useStyleProps(otherProps);
  let allProps: SpectrumBaseDialogProps = mergeProps(
    mergeProps(
      mergeProps(
        filterDOMProps(otherProps),
        contextProps
      ),
      styleProps
    ),
    {className: classNames(styles, {'spectrum-Dialog--dismissable': isDismissable})}
    );

  if (type === 'popover') {
    return <BaseDialog {...allProps} size={otherProps.size}>{children}</BaseDialog>;
  } else {
    return (
      <ModalDialog {...allProps} size={otherProps.size}>
        {children}
        {isDismissable && <ActionButton slot="closeButton" isQuiet icon={<CrossLarge size="L" />} />}
      </ModalDialog>
    );
  }
}

function ModalDialog(props: SpectrumBaseDialogProps) {
  let {modalProps} = useModalDialog();
  return <BaseDialog {...mergeProps(props, modalProps)} />;
}

let sizeMap = {
  S: 'small',
  M: 'medium',
  L: 'large',
  fullscreen: 'fullscreen',
  fullscreenTakeover: 'fullscreenTakeover'
};

function BaseDialog({children, slots, size = 'L', role, ...otherProps}: SpectrumBaseDialogProps) {
  let ref = useRef();
  let {dialogProps} = useDialog({ref, role});
  if (!slots) {
    slots = {
      container: styles['spectrum-Dialog-grid'],
      hero: styles['spectrum-Dialog-hero'],
      header: styles['spectrum-Dialog-header'],
      title: styles['spectrum-Dialog-title'],
      typeIcon: styles['spectrum-Dialog-typeIcon'],
      divider: styles['spectrum-Dialog-divider'],
      content: styles['spectrum-Dialog-content'],
      footer: styles['spectrum-Dialog-footer'],
      closeButton: styles['spectrum-Dialog-closeButton']
    };
  }

  /* possible weird bug where radio group isn't a single tab stop, FocusScope? */
  return (
    <FocusScope contain restoreFocus autoFocus>
      <div
        {...mergeProps(otherProps, dialogProps)}
        className={classNames(
          styles,
          'spectrum-Dialog',
          {[`spectrum-Dialog--${sizeMap[size]}`]: size},
          otherProps.className
        )}
        ref={ref}>
        <Grid slots={slots}>
          {children}
        </Grid>
      </div>
    </FocusScope>
  );
}
