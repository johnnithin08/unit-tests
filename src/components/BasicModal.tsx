import React, { FunctionComponent } from "react";
import Modal from "react-native-modal";





export const BasicModal: FunctionComponent<IBasicModalProps> = ({
  animationIn,
  animationInTiming,
  animationOut,
  animationOutTiming,
  backdropColor,
  backdropOpacity,
  hasBackdrop,
  children,
  onClose,
  style,
  testId,
  visible,
}: IBasicModalProps) => {
  const defaultAnimationIn = animationIn !== undefined ? animationIn : "fadeIn";
  const defaultAnimationOut = animationOut !== undefined ? animationOut : "fadeOut";

  const handleClose = () => {
    if (onClose !== undefined) {
      onClose();
    }
  };

  return (
    <Modal
      backdropOpacity={backdropOpacity || 0.7}
      hasBackdrop={hasBackdrop}
      backdropColor={backdropColor }
      animationIn={defaultAnimationIn}
      animationInTiming={animationInTiming}
      animationOut={defaultAnimationOut}
      animationOutTiming={animationOutTiming}
      isVisible={visible }
      onModalHide={handleClose}
      style={{  ...style }}
      testID={testId}>
      {children}
    </Modal>
  );
};
