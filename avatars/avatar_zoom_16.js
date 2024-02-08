import React from 'react';
                    
export default function zoomAvatar(props) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" {...props}>
      <rect width="16" height="16" fill="url(#pattern0)"/>
      <rect width="16" height="15.999" fill="url(#pattern1)"/>
      <defs>
      <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
      <use xlinkHref="#image0_19100_338" transform="scale(0.0078125)"/>
      </pattern>
      <pattern id="pattern1" patternContentUnits="objectBoundingBox" width="1" height="1">
      <use xlinkHref="#image1_19100_338" transform="scale(0.0078125)"/>
      </pattern>
      <image id="image0_19100_338" width="128" height="128" xlinkHref="data:image/png;base64,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"/>
      <image id="image1_19100_338" width="128" height="128" xlinkHref="data:image/png;base64,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"/>
      </defs>
    </svg>
  );
}
