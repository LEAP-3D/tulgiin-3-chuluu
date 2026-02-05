import * as React from "react";
import Svg, { Path } from "react-native-svg";

const GadnaTalbaiIcon = (props: any) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path
      d="M13 19v3m-1-3h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"
      stroke="#FE9825"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.925 16v6m3-12v.2a3 3 0 0 1-1.1 5.8h-3.9a3 3 0 0 1-1-5.8V10a3 3 0 1 1 6 0Z"
      stroke="#000"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default GadnaTalbaiIcon;
