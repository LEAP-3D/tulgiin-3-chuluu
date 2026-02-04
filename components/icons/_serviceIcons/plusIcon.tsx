import * as React from "react";
import Svg, { Path } from "react-native-svg";

const PlusIcon = (props: any) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M5 12h14m-7-7v14"
      stroke="#757575"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default PlusIcon;
