import * as React from "react";
import Svg, { Path } from "react-native-svg";

const SantehnikIcon = (props: any) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19-1.14-.93-2-2.31-2.29-3.76a6.585 6.585 0 0 1-2.29 3.76C3.56 9.98 3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05Z"
      stroke="#FE9825"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.47 6.58A10.97 10.97 0 0 0 12.91 3c.5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5A6.98 6.98 0 0 1 8 19.97"
      stroke="#000"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default SantehnikIcon;
