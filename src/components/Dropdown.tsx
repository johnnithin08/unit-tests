import React, { Fragment, FunctionComponent, useEffect, useState } from "react";
import { FlatList, Keyboard, Text, TextStyle, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import Collapsible from "react-native-collapsible";


import { CustomTextInput } from "./Input";
import { BasicModal } from "./BasicModal";
import { CustomFlexSpacer, CustomSpacer } from "./Spacer";
import { fullHW, centerVertical, flexRow, px, py, centerHV, circle } from "../styles/common";



interface NewDropdownProps {
  disabled?: boolean;
  error?: string;
  handleChange: (text: string) => void;
  items: TypeLabelValue[];
  keyboardAvoidingRef?: TypeKeyboardAvoidingView;
  label?: string;
  labelStyle?: TextStyle;
  maxHeight?: number;
  placeholder?: string;
  spaceToLabel?: number;
  spaceToTop?: number;
  style?: ViewStyle;
  testId?: string;
  value: string;
  viewStyle?: ViewStyle;
}

export const NewDropdown: FunctionComponent<NewDropdownProps> = ({
  disabled,
  error,
  handleChange,
  items,
  keyboardAvoidingRef,
  label,
  labelStyle,
  maxHeight,
  placeholder,
  spaceToLabel,
  spaceToTop,
  style,
  testId,
  value,
  viewStyle,
}: NewDropdownProps) => {
  const [layout, setLayout] = useState<IBasicLayout>({ x: 0, y: 0, width: 0, height: 0 });
  const [ref, setRef] = useState<View | null>(null);
  const [collapse, setCollapse] = useState<boolean>(true);
  const [collapsibleModal, setCollapsibleModal] = useState<boolean>(false);
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);

  const placeholderLabel = placeholder || "Placeholder";

  const defaultLabelSpace = spaceToLabel === undefined ? 4 : spaceToLabel;
  const labelExtractor = items.map((item) => item.label);

  // TODO
  /**
   * Known Issues:
   * 1. Absolute position is wrong when keyboard is open (quick solution, pass keyboardAvoidingRef)
   */

  const handleAnimationClose = () => {
    setCollapse(true);
    setTimeout(() => {
      setCollapsibleModal(false);
    }, 80);
  };

  const handleBackdropPress = () => {
    handleAnimationClose();
  };

  const handleExpand = () => {
    if (disabled !== true) {
      Keyboard.dismiss();
      if (ref !== null && keyboardVisible === false) {
        ref.measure((_x, _y, _width, _height, pageX, pageY) => {
          const measurement = { x: pageX, y: pageY, height: _height, width: _width };
          if (keyboardAvoidingRef !== undefined && keyboardAvoidingRef !== null) {
            Keyboard.dismiss();
            const keyboardOffset = keyboardAvoidingRef.state.bottom;
            measurement.y += keyboardOffset;
            setLayout({ x: pageX, y: pageY + keyboardOffset, height: _height, width: _width });
          } else {
            setLayout(measurement);
          }
        });
        setCollapsibleModal(!collapsibleModal);
        setTimeout(() => {
          setCollapse(false);
        }, 80);
      }
    }
  };

  const dropdownContainer: ViewStyle = {
    backgroundColor: "white",
    borderColor: "blue",
    borderRadius: 16,
    borderWidth: 2,
    left: layout.x,
    position: "absolute",
    top: layout.y,
    width: 360,
    zIndex: 3,
    ...viewStyle,
  };

  const placeholderStyle: TextStyle = value ? {} : { color: "black" };

  const handleKeyboardDidShow = () => {
    setKeyboardVisible(true);
  };
  const handleKeyboardHide = () => {
    setKeyboardVisible(false);
  };

  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener("keyboardDidShow", handleKeyboardDidShow);
    const keyboardDidHide = Keyboard.addListener("keyboardDidHide", handleKeyboardHide);
    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  return (
    <Fragment>
      <View>
        {spaceToTop !== undefined ? <CustomSpacer space={spaceToTop} /> : null}
        {label === undefined ? null : (
          <Fragment>
            <Text style={{  ...labelStyle }}>{label}</Text>
            <CustomSpacer space={defaultLabelSpace} />
          </Fragment>
        )}
        <View ref={setRef} renderToHardwareTextureAndroid={true}>
          <TouchableWithoutFeedback onPress={handleExpand} testID={testId}>
            <View onStartShouldSetResponderCapture={() => true}>
              <CustomTextInput
                disabled={disabled}
                error={error}
                editable={false}
                placeholder={placeholderLabel}
                placeholderTextColor={"grey"}
                rightIcon={{ name: "caret-down" }}
                viewStyle={{  ...viewStyle }}
                value={value}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <BasicModal animationOutTiming={80} visible={collapsibleModal} hasBackdrop={false}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View style={fullHW}>
            <View style={dropdownContainer}>
              <View style={{ ...centerVertical, ...flexRow, height: 44, ...px(15) }}>
                <Text numberOfLines={1} style={{  ...placeholderStyle, maxWidth: 286 }}>
                  {value || placeholderLabel}
                </Text>
                <CustomFlexSpacer />
              </View>
              <Collapsible duration={100} collapsed={collapse} >
                <View style={{ borderTopWidth: 2, borderTopColor: "blue", maxHeight: maxHeight }}>
                  <View style={style}>
                    <FlatList
                      data={labelExtractor}
                      style={{ borderBottomLeftRadius: 16, borderBottomRightRadius: 16, maxHeight: 176 }}
                      keyboardDismissMode="on-drag"
                      keyboardShouldPersistTaps="always"
                      keyExtractor={(item: string, index: number) => `${item}-${index}`}
                      ListHeaderComponent={() => <CustomSpacer space={8} />}
                      ListFooterComponent={() => <CustomSpacer space={8} />}
                      renderItem={({ index }) => {
                        const itemExtractor = items[index];
                        const itemContainer: ViewStyle = { ...centerVertical, ...flexRow, ...py(8), ...px(16) };
                        const selectedStyle: ViewStyle = value === itemExtractor.label ? { backgroundColor: "blue" } : {};

                        const handleSelect = () => {
                          handleAnimationClose();
                          setTimeout(() => {
                            if (itemExtractor !== undefined) {
                              handleChange(itemExtractor.value);
                            }
                          }, 250);
                        };

                        return (
                          <TouchableWithoutFeedback key={index} onPress={handleSelect}>
                            <View style={{ ...itemContainer, ...selectedStyle }}>
                              {index === 0 || <CustomSpacer space={8} />}
                              <Text numberOfLines={1} style={{  maxWidth: value === itemExtractor.label ? 296 : 328 }}>
                                {itemExtractor.label}
                              </Text>
                              {value === itemExtractor.label ? (
                                <Fragment>
                                  <CustomFlexSpacer />
                                  <View style={{ ...centerHV, ...circle(16, "green") }}>
                                  </View>
                                </Fragment>
                              ) : null}
                              {index === labelExtractor.length - 1 || <CustomSpacer space={8} />}
                            </View>
                          </TouchableWithoutFeedback>
                        );
                      }}
                      showsVerticalScrollIndicator={false}
                    />
                  </View>
                </View>
              </Collapsible>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </BasicModal>
    </Fragment>
  );
};
