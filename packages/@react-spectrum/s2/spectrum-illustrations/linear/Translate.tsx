/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {IconProps, IllustrationContext} from '../../src/Icon';
import Translate_L from 'illustration:./S2_lin_translate_160.svg';
import Translate_M from 'illustration:./S2_lin_translate_96.svg';
import Translate_S from 'illustration:./S2_lin_translate_48.svg';
import {useContextProps} from 'react-aria-components';

export default function Translate(props: IconProps & {size?: 'L' | 'S' | 'M'}) {
  [props] = useContextProps(props, null, IllustrationContext);
  let {size = 'M', ...otherProps} = props;
  switch (size) {
    case 'L':
      return <Translate_L {...otherProps} />;
    case 'S':
      return <Translate_S {...otherProps} />;
    case 'M':
      return <Translate_M {...otherProps} />;
  }
}
