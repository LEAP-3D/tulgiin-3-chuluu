import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

export default function MessageIcon(props: SvgProps) {
  return (
    <Svg viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fill={props.color || "#757575"}
        d="M20.25 4.5H3.75A1.5 1.5 0 0 0 2.25 6v15a1.485 1.485 0 0 0 .867 1.36 1.49 1.49 0 0 0 1.594-.214l.008-.007L7.781 19.5H20.25a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5Zm0 13.5H7.5a.75.75 0 0 0-.49.183L3.75 21V6h16.5v12Z"
      />
    </Svg>
  );
}
