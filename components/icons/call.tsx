import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

export default function CallIcon(props: SvgProps) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none" {...props}>
      <Path
        stroke={props.color || "#fff"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12.582 15.318a1 1 0 0 0 1.213-.303l.355-.465a2 2 0 0 1 1.6-.8h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2 18 18 0 0 1-18-18 2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384Z"
      />
    </Svg>
  );
}
