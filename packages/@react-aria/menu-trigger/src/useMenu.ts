import {AllHTMLAttributes} from 'react';
import {CollectionBase, DOMProps, Expandable, MultipleSelection} from '@react-types/shared';
import {ListLayout} from '@react-stately/collections';
import {TreeState} from '@react-stately/tree';
import {useId} from '@react-aria/utils';
import {useSelectableCollection} from '@react-aria/selection';

type orientation = 'vertical' | 'horizontal'

// TODO reuse the MenuProps in Menu.tsx
interface MenuAriaProps<T> extends CollectionBase<T>, Expandable, MultipleSelection, DOMProps {
  'aria-orientation'?: orientation
}

interface MenuAria {
  menuProps: AllHTMLAttributes<HTMLElement>,
  menuItemProps: AllHTMLAttributes<HTMLElement>
}

interface MenuState<T> extends TreeState<T> {}

interface MenuLayout<T> extends ListLayout<T> {}

export function useMenu<T>(props: MenuAriaProps<T>, state: MenuState<T>, layout: MenuLayout<T>): MenuAria {
  let {
    'aria-orientation': ariaOrientation = 'vertical' as orientation,
    role = 'menu',
    id,
    selectionMode
  } = props;

  let menuId = useId(id);

  let {listProps} = useSelectableCollection({
    selectionManager: state.selectionManager,
    keyboardDelegate: layout
  });  

  let menuItemRole = 'menuitem';
  if (role === 'listbox') {
    menuItemRole = 'option';
  } else if (selectionMode === 'single') {
    menuItemRole = 'menuitemradio';
  } else if (selectionMode === 'multiple') {
    menuItemRole = 'menuitemcheckbox';
  }

  return {
    menuProps: {
      ...listProps,
      id: menuId,
      role,
      'aria-orientation': ariaOrientation
    },
    menuItemProps: {
      role: menuItemRole
    }
  };
}
