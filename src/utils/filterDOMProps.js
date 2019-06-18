/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2019 Adobe
* All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.
**************************************************************************/

const DOMProps = {
  'abbr': 1,
  'accept': 1,
  'acceptCharset': 1,
  'accessKey': 1,
  'action': 1,
  'allowFullScreen': 1,
  'allowTransparency': 1,
  'alt': 1,
  'async': 1,
  'autoComplete': 1,
  'autoFocus': 1,
  'autoPlay': 1,
  'cellPadding': 1,
  'cellSpacing': 1,
  'challenge': 1,
  'charset': 1,
  'checked': 1,
  'cite': 1,
  'class': 1,
  'className': 1,
  'cols': 1,
  'colSpan': 1,
  'command': 1,
  'content': 1,
  'contentEditable': 1,
  'contextMenu': 1,
  'controls': 1,
  'coords': 1,
  'crossOrigin': 1,
  'data': 1,
  'dateTime': 1,
  'default': 1,
  'defer': 1,
  'dir': 1,
  'disabled': 1,
  'download': 1,
  'draggable': 1,
  'dropzone': 1,
  'encType': 1,
  'for': 1,
  'form': 1,
  'formAction': 1,
  'formEncType': 1,
  'formMethod': 1,
  'formNoValidate': 1,
  'formTarget': 1,
  'frameBorder': 1,
  'headers': 1,
  'height': 1,
  'hidden': 1,
  'high': 1,
  'href': 1,
  'hrefLang': 1,
  'htmlFor': 1,
  'httpEquiv': 1,
  'icon': 1,
  'id': 1,
  'inputMode': 1,
  'isMap': 1,
  'itemId': 1,
  'itemProp': 1,
  'itemRef': 1,
  'itemScope': 1,
  'itemType': 1,
  'kind': 1,
  'label': 1,
  'lang': 1,
  'list': 1,
  'loop': 1,
  'manifest': 1,
  'max': 1,
  'maxLength': 1,
  'media': 1,
  'mediaGroup': 1,
  'method': 1,
  'min': 1,
  'minLength': 1,
  'multiple': 1,
  'muted': 1,
  'name': 1,
  'noValidate': 1,
  'open': 1,
  'optimum': 1,
  'pattern': 1,
  'ping': 1,
  'placeholder': 1,
  'poster': 1,
  'preload': 1,
  'radioGroup': 1,
  'readOnly': 1,
  'rel': 1,
  'required': 1,
  'role': 1,
  'rows': 1,
  'rowSpan': 1,
  'sandbox': 1,
  'scope': 1,
  'scoped': 1,
  'scrolling': 1,
  'seamless': 1,
  'selected': 1,
  'shape': 1,
  'size': 1,
  'sizes': 1,
  'sortable': 1,
  'span': 1,
  'spellCheck': 1,
  'src': 1,
  'srcDoc': 1,
  'srcSet': 1,
  'start': 1,
  'step': 1,
  'style': 1,
  'tabIndex': 1,
  'target': 1,
  'title': 1,
  'translate': 1,
  'type': 1,
  'typeMustMatch': 1,
  'useMap': 1,
  'value': 1,
  'width': 1,
  'wmode': 1,
  'wrap': 1,
  'onCopy': 1,
  'onCut': 1,
  'onPaste': 1,
  'onLoad': 1,
  'onError': 1,
  'onWheel': 1,
  'onScroll': 1,
  'onCompositionEnd': 1,
  'onCompositionStart': 1,
  'onCompositionUpdate': 1,
  'onKeyDown': 1,
  'onKeyPress': 1,
  'onKeyUp': 1,
  'onFocus': 1,
  'onBlur': 1,
  'onChange': 1,
  'onInput': 1,
  'onSubmit': 1,
  'onClick': 1,
  'onContextMenu': 1,
  'onDoubleClick': 1,
  'onDrag': 1,
  'onDragEnd': 1,
  'onDragEnter': 1,
  'onDragExit': 1,
  'onDragLeave': 1,
  'onDragOver': 1,
  'onDragStart': 1,
  'onDrop': 1,
  'onMouseDown': 1,
  'onMouseEnter': 1,
  'onMouseLeave': 1,
  'onMouseMove': 1,
  'onMouseOut': 1,
  'onMouseOver': 1,
  'onMouseUp': 1,
  'onSelect': 1,
  'onTouchCancel': 1,
  'onTouchEnd': 1,
  'onTouchMove': 1,
  'onTouchStart': 1,
  'onAnimationStart': 1,
  'onAnimationEnd': 1,
  'onAnimationIteration': 1,
  'onTransitionEnd': 1
};

/**
 * Checking for aria-* and data-* props
 */
const propRe = /^((data|aria)-.*)$/;

export default function filterReactDomProps(props) {
  const filterProps = {};

  for (const prop in props) {
    if (props.hasOwnProperty(prop) && (DOMProps[prop] || propRe.test(prop))) {
      filterProps[prop] = props[prop];
    }
  }
  return filterProps;
}
