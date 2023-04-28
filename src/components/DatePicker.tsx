import DateTimePicker from "@react-native-community/datetimepicker";
import moment, { isDate } from "moment";
import React, { Fragment, FunctionComponent, useEffect, useState } from "react";
import { Keyboard, Text, TextStyle, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import Collapsible from "react-native-collapsible";

import { CustomTextInput } from "./Input";
import { BasicModal } from "./BasicModal";
import { CustomButton } from "./Button";
import { CustomFlexSpacer } from "./Spacer";
import { fullHW, centerVertical, flexRow, px } from "../styles/common";


interface NewDatePickerProps {
  buttonStyle?: ViewStyle;
  buttonText?: string;
  datePickerStyle?: ViewStyle;
  disabled?: boolean;
  error?: string;
  initialDate?: Date;
  keyboardAvoidingRef?: TypeKeyboardAvoidingView;
  maximumDate?: Date;
  minimumDate?: Date;
  mode: "date" | "time";
  placeholder?: string;
  selectedFormat?: string;
  setValue: (value: Date) => void;
  testId?: string;
  testIdModal?: string;
  value?: Date;
  viewStyle?: ViewStyle;
}

export const NewDatePicker: FunctionComponent<NewDatePickerProps> = ({
  buttonStyle,
  buttonText,
  datePickerStyle,
  disabled,
  error,
  mode,
  initialDate,
  keyboardAvoidingRef,
  minimumDate,
  maximumDate,
  placeholder,
  selectedFormat,
  setValue,
  testId,
  testIdModal,
  value,
  viewStyle,
}: NewDatePickerProps) => {
  const [layout, setLayout] = useState<IBasicLayout>({ x: 0, y: 0, width: 0, height: 0 });
  const [ref, setRef] = useState<View | null>(null);
  const [collapse, setCollapse] = useState<boolean>(true);
  const [collapsibleModal, setCollapsibleModal] = useState<boolean>(false);
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);

  const maxDate: Date = maximumDate !== undefined ? maximumDate : new Date();
  const defaultInitialDate = initialDate !== undefined ? initialDate : maxDate;
  const defaultDate = isDate(value) ? value : defaultInitialDate;
  const [selectedDate, setSelectedDate] = useState<Date>(defaultDate);

  const modeFormat = mode === "date" ? "DD/MM/YYYY" : "h:mm A";
  const defaultFormat = selectedFormat !== undefined ? selectedFormat : modeFormat;

  const initialValue = value !== undefined ? value : "";
  const selectedValue = isDate(initialValue) ? moment(initialValue).format(defaultFormat) : "";

  const icon = mode === "date" ? "calendar" : "clock";
  const defaultPlaceholder = mode === "date" ? "dd/mm/yyyy" : "12:00 PM";
  const customPlaceholder = placeholder !== undefined ? placeholder : defaultPlaceholder;

  // TODO
  /**
   * Known Issues:
   * 1. Absolute position is wrong when keyboard is open (quick solution, pass keyboardAvoidingRef)
   */

  const handleDateChange = (_event: Event, date?: Date) => {
    if (date !== undefined) {
      setSelectedDate(date);
    }
  };

  const handleAnimationClose = () => {
    setCollapse(true);
    setTimeout(() => {
      setCollapsibleModal(false);
    }, 80);
  };

  const handleBackdropPress = () => {
    if (selectedDate !== value) {
      setSelectedDate(defaultDate);
    }
    handleAnimationClose();
  };

  const handleConfirmDate = () => {
    setValue(selectedDate);
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

  const placeholderStyle: TextStyle = selectedValue ? {} : { color: "grey" };
  const pickerStyle: ViewStyle = { height: 228, ...datePickerStyle };

  const defaultButtonStyle: ViewStyle = {
    backgroundColor: "blue",
    borderWidth: 0,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    width: 356,
    ...buttonStyle,
  };

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
      <View ref={setRef} renderToHardwareTextureAndroid={true}>
        <TouchableWithoutFeedback onPress={handleExpand} testID={testId}>
          <View onStartShouldSetResponderCapture={() => true}>
            <CustomTextInput
              disabled={disabled}
              error={error}
              editable={false}
              placeholder={customPlaceholder}
              rightIcon={{ name: icon }}
              value={selectedValue}
              viewStyle={viewStyle}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
      <BasicModal animationOutTiming={80} visible={collapsibleModal} hasBackdrop={false} testId={testIdModal}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View style={fullHW}>
            <View style={dropdownContainer}>
              <View style={{ ...centerVertical, ...flexRow, height: 44, ...px(15) }}>
                <Text style={{  ...placeholderStyle }}>{selectedValue || customPlaceholder}</Text>
                <CustomFlexSpacer />
              </View>
              <Collapsible duration={100} collapsed={collapse} >
                <View style={{ borderTopWidth: 2, borderTopColor: "blue" }}>
                  <View style={pickerStyle}>
                    <DateTimePicker
                      display="spinner"
                      is24Hour={true}
                      maximumDate={maximumDate}
                      minimumDate={minimumDate}
                      mode={mode}
                      onChange={handleDateChange}
                      style={pickerStyle}
                      textColor="black"
                      value={selectedDate}
                    />
                  </View>
                  <View style={{ backgroundColor: "blue", borderBottomRightRadius: 12, borderBottomLeftRadius: 12 }}>
                    <CustomButton
                      buttonStyle={defaultButtonStyle}
                      onPress={handleConfirmDate}
                      text={"Confirm Date"}
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
