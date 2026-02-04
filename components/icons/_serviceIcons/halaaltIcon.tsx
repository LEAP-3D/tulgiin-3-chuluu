import * as React from "react";
import Svg, { Path } from "react-native-svg";

const HalaaltIcon = (props: any) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M6 10h.01M6 14h.01M10 16v-4m4 4v-4m4 4v-4m2-6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3M5 20v2m14-2v2"
      stroke="#000"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.577 8c2-3-2-3 0-6m4.5 6c2-3-2-3 0-6"
      stroke="#FE9825"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default HalaaltIcon;
