import * as React from "react";
import Svg, { Path } from "react-native-svg";

const ShilToliIcon = (props: any) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 3v18m-9-9v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v7Z"
      stroke="#000"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="m5.707 7.121 1.414-1.414m-.707 3.535 2.829-2.828M14.707 13.121l1.414-1.414m-.707 3.536 2.829-2.829"
      stroke="#FE9825"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ShilToliIcon;
