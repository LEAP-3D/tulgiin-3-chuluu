import * as React from "react";
import Svg, { Rect, SvgProps } from "react-native-svg";

const RedDotIcon: React.FC<SvgProps> = (props) => (
  <Svg width={8} height={8} viewBox="0 0 8 8" fill="none" {...props}>
    <Rect width={8} height={8} rx={4} fill="#D73030" />
  </Svg>
);

export default RedDotIcon;
