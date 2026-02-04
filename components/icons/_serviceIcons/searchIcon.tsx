import * as React from "react";
import Svg, { Path } from "react-native-svg";

const SearchIcon = (props: any) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <Path
      d="m17.5 17.5-3.617-3.617m1.95-4.716a6.667 6.667 0 1 1-13.333 0 6.667 6.667 0 0 1 13.333 0Z"
      stroke="#757575"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default SearchIcon;
