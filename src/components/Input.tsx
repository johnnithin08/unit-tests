import React, { Fragment, FunctionComponent, RefObject, useState } from "react";
import { NativeSyntheticEvent, Text, TextInput, TextInputFocusEventData, TextInputProps, TextStyle, View, ViewStyle } from "react-native";

import { CustomSpacer } from "./Spacer";
import { border, centerVertical, customShadow, flexChild, flexRow, px } from "../styles/common";

export interface CustomTextInputProps extends TextInputProps {
  containerStyle?: ViewStyle;
  clearAll?: boolean;
  disabled?: boolean;
  error?: string;
  inputPrefix?: string;
  increaseErrorWidth?: boolean;
  label?: string;
  labelStyle?: TextStyle;
  leftIcon?: IIcon;
  noBorder?: boolean;
  onPressLabel?: () => void;
  prefixStyle?: TextStyle;
  rightIcon?: IIcon;
  setRef?: string | ((instance: TextInput | null) => void) | RefObject<TextInput> | null;
  spaceToBottom?: number;
  spaceToLabel?: number;
  spaceToTop?: number;
  style?: TextStyle;
  testID?: string;
  viewStyle?: ViewStyle;
}

export const CustomTextInput: FunctionComponent<CustomTextInputProps> = ({
  containerStyle,
  clearAll,
  disabled,
  increaseErrorWidth,
  error,
  inputPrefix,
  label,
  labelStyle,
  leftIcon,
  noBorder,
  onBlur,
  onFocus,
  onLayout,
  onPressLabel,
  placeholder,
  prefixStyle,
  rightIcon,
  setRef,
  spaceToBottom,
  spaceToLabel,
  spaceToTop,
  style,
  testID,
  value,
  viewStyle,
  ...textInputProps
}: CustomTextInputProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const borderWidth = noBorder === true ? { borderWidth: 0 } : {};
  const disabledOpacity = disabled === true ? { opacity: 0.6 } : {};
  const disabledStyle = disabled === true ? { ...disabledOpacity, backgroundColor: "grey" } : {};
  const errorStyle: ViewStyle = error !== undefined ? { backgroundColor: "red", borderWidth: 2, borderColor: "red" } : {};
  const focusedShadow = isFocused ? customShadow("blu", 0, 0, 0.02, 4) : {};

  const defaultContainerStyle: ViewStyle = {
    paddingTop: spaceToTop !== undefined ? spaceToTop : 0,
    paddingBottom: spaceToBottom !== undefined ? spaceToBottom : 0,
  };

  const defaultInputStyle: ViewStyle = {
    ...border(isFocused ? "blue" : "grey", isFocused ? 2 : 1, 32),
    ...centerVertical,
    ...flexRow,
    ...px(isFocused === false && error === undefined ? 16 : 15),
    backgroundColor: "white",
    height: 48,
    width: 360,
    ...borderWidth,
    ...focusedShadow,
    ...errorStyle,
    ...disabledStyle,
    ...viewStyle,
  };

  const inputStyle: TextStyle = {
    ...flexChild,
    color: "black",
    fontSize: 16,
    height: isFocused ? 50 : 48, // height is more than the input view size to adjust the keyboard avoiding view
    ...style,
  };

  const errorWidthStyle: TextStyle = {
    width: increaseErrorWidth ? 362 : 336,
    lineHeight: 16,
  };

  const handleBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (onBlur) {
      onBlur(event);
    }
    setIsFocused(false);
  };


  const handleFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (onFocus) {
      onFocus(event);
    }
    setIsFocused(true);
  };

  return (
    <View onLayout={onLayout} style={{ width: 360, ...defaultContainerStyle, ...containerStyle }}>
      {label === undefined ? null : (
        <Text
          onPress={onPressLabel}
          style={{  paddingBottom: spaceToLabel || 4, ...labelStyle }}
          suppressHighlighting={true}>
          {label}
        </Text>
      )}
      <View style={defaultInputStyle}>
        {inputPrefix !== undefined ? (
          <Fragment>
            <Text style={{  ...prefixStyle }}>{inputPrefix}</Text>
            <CustomSpacer isHorizontal={true} space={8} />
          </Fragment>
        ) : null}
        <TextInput
          autoCorrect={false}
          editable={!disabled}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          placeholderTextColor={"grey"}
          ref={setRef}
          selectionColor={"grey"}
          spellCheck={false}
          style={inputStyle}
          testID={testID}
          value={value}
          {...textInputProps}
        />
      </View>
      {error === undefined ? null : (
        <View>
          <CustomSpacer space={4} />
          <View style={flexRow}>
            <Text style={errorWidthStyle}>{error}</Text>
          </View>
        </View>
      )}
    </View>
  );
};
