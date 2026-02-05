import * as React from "react";
import Svg, { Path } from "react-native-svg";

const TawilgaIcon = (props: any) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"
      stroke="#FE9825"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 18a2 2 0 0 1-2-2v-5a2 2 0 0 1 4 0v1.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V11a2 2 0 1 1 4 0v5a2 2 0 0 1-2 2M4 18h16M4 18v2m16-2v2"
      stroke="#000"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default TawilgaIcon;
