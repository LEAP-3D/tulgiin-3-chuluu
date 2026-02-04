import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

const SparklesIcon = (props: any) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <G clipPath="url(#clip)">
      <Path
        d="M20 2v4m2-2h-4m-6.983-1.186a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a1.999 1.999 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594l1.051-5.558ZM6 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
        stroke="#FE9825"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>

    <Defs>
      <ClipPath id="clip">
        <Path d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default SparklesIcon;
