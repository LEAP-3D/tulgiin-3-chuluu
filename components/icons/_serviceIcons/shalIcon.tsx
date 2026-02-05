import * as React from "react";
import Svg, { Path } from "react-native-svg";

const ShalIcon = (props: any) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 9H3V5a2 2 0 0 1 2-2h7v12.5m0 0V21h7a2 2 0 0 0 2-2v-3.5h-9Z"
      stroke="#FE9825"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 9H3v10a2 2 0 0 0 2 2h7v-5.5m0 0V3h7a2 2 0 0 1 2 2v10.5h-9Z"
      stroke="#000"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ShalIcon;
