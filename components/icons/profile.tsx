import Svg, { Circle, Path } from "react-native-svg";

export const ProfileIcon = ({
  size = 24,
  color = "#757575",
  strokeWidth = 1.7,
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="8"
        r="4"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Path
        d="M4 20c0-3.6 3.6-6 8-6s8 2.4 8 6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
};
