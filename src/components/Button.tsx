import debounce from "lodash.debounce";
import React, { Fragment, FunctionComponent, useCallback, useState } from "react";
import {  Text, TextStyle, TouchableWithoutFeedback, ViewStyle } from "react-native";




import { border, flexRowCC } from "../styles/common";

export interface CustomButtonProps {
  buttonStyle?: ViewStyle;
  disabled?: boolean;
  icon?: string;
  iconColor?: string;
  iconSize?: number;
  loading?: boolean;
  onPress: () => void;
  secondary?: boolean;
  text: string;
  textStyle?: TextStyle;
  withDebounce?: boolean;
}

export const CustomButton: FunctionComponent<CustomButtonProps> = ({
  buttonStyle,
  disabled,
  icon,
  iconColor,
  iconSize,
  loading,
  onPress,
  secondary,
  text,
  textStyle,
  withDebounce,
}: CustomButtonProps) => {
  const [hover, setHover] = useState<boolean>(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncePress = useCallback(
    debounce(onPress, 1000, {
      leading: true,
      trailing: false,
    }),
    [onPress],
  );

  const color =  "red";

  const defaultButtonStyle: ViewStyle = {
    ...border(color, 2),
    ...flexRowCC,
    backgroundColor: secondary ? "white" : color,
    height: 48,
    opacity: disabled === true ? 0.5 : 1,
    width: 240,
    ...buttonStyle,
  };

  const defaultIconColor = iconColor !== undefined ? iconColor : "white";
  const textColor = secondary ? "grey" : "white";

  const handlePress = () => {
      onPress();
  };

  return (
    <TouchableWithoutFeedback
      onPress={disabled === true ? undefined : handlePress}
      onPressIn={() => setHover(true)}
      onPressOut={() => setHover(false)}
      style={defaultButtonStyle}
      testID="button-test">
      <Fragment>
        <Text style={{  color: textColor, ...textStyle }}>{text}</Text>
      </Fragment>
    </TouchableWithoutFeedback>
  );
};
