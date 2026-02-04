import * as React from "react";
import Svg, { Path, Circle } from "react-native-svg";

const TewrelgeeIcon = (props: any) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={12} cy={8} r={4} stroke="#FE9825" strokeWidth={2} />
    <Path
      d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
      stroke="#FE9825"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

export default TewrelgeeIcon;
