import * as React from "react";
import Svg, { Path } from "react-native-svg";

const LeftArrowIcon = (props: any) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="m12 19-7-7m0 0 7-7m-7 7h14"
      stroke="#000"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default LeftArrowIcon;
