import * as React from "react";
import Svg, { Path } from "react-native-svg";

const NvvlgeltIcon = (props: any) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M13 6v5a1 1 0 0 0 1 1h6.102a1 1 0 0 1 .712.298l.898.91a1 1 0 0 1 .288.702V17a1 1 0 0 1-1 1h-3M5 18H3a1 1 0 0 1-1-1V8a2 2 0 0 1 2-2h12c1.1 0 2.1.8 2.4 1.8l1.176 4.2"
      stroke="#000"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M10 18h3" stroke="#000" strokeWidth={2} strokeLinecap="round" />
    <Path
      d="M16 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
      stroke="#FE9825"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default NvvlgeltIcon;
