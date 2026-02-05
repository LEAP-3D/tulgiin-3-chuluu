import * as React from "react";
import Svg, { Path } from "react-native-svg";

const AgaarjuulaltIcon = (props: any) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
      stroke="#000"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18 17.5a2.5 2.5 0 1 1-4 2.03V12M6 8h12M6.6 15.572A2 2 0 1 0 10 17v-5"
      stroke="#FE9825"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default AgaarjuulaltIcon;
