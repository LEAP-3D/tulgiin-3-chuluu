import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

export const UbZyroIcon = ({
  width = 96,
  height = 28,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 96 28" fill="none">
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="96" y2="0">
          <Stop offset="0%" stopColor="#27B3E6" />
          <Stop offset="100%" stopColor="#F6A623" />
        </LinearGradient>
      </Defs>

      {/* ⬇️ ЭНД SVG-ээс авсан path-ууд орно */}
      <Path
        d="M4 24V4H14.2C18.4 4 21 6.6 21 10C21 13.4 18.4 16 14.2 16H8V24H4Z"
        fill="url(#grad)"
      />

      {/* ZYRO path-ууд энд */}
    </Svg>
  );
};
