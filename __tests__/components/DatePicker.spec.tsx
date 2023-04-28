import { act, cleanup, fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react-native";
import React from "react";

import { NewDatePicker } from "../../src/components/DatePicker";

jest.mock('react-native', () => {
  const ActualReactNative = jest.requireActual('react-native');

  ActualReactNative.UIManager.measureInWindow = (node, callback) => {
    callback(0, 0, 42, 42);
  };

  ActualReactNative.Animated = {
    ...ActualReactNative.Animated,
    timing: () => ({
      start: (callback) => {
        callback();
      },
    }),
  };

  return ActualReactNative;
});

jest.mock('react-native/Libraries/Modal/Modal', () => {
  const Modal = jest.requireActual('react-native/Libraries/Modal/Modal')
  return (props) => <Modal {...props} />
})

describe("Unit testing for DateTimePicker", () => {
  it("render NewDatePicker with type date", () => {
    const mockFn = jest.fn();
    render(<NewDatePicker mode="date" setValue={mockFn} value={undefined} />);
  });

  it("render NewDatePicker with type time", () => {
    const mockFn = jest.fn();
    render(<NewDatePicker mode="time" setValue={mockFn} value={undefined} />);
  });

  it("render NewDatePicker with type date, disabled", () => {
    const mockFn = jest.fn();
    render(<NewDatePicker disabled={true} mode="time" setValue={mockFn} value={undefined} />);
  });

  it("render NewDatePicker with type date, error", () => {
    const mockFn = jest.fn();
    render(<NewDatePicker error="Test Error" mode="time" setValue={mockFn} value={undefined} />);
  });

  it("render NewDatePicker with type date, buttonText", () => {
    const mockFn = jest.fn();
    render(<NewDatePicker buttonText="Test" mode="time" setValue={mockFn} value={undefined} />);
  });

  it("render NewDatePicker with type date, placeholder", () => {
    const mockFn = jest.fn();
    render(<NewDatePicker placeholder="Test Placeholder" mode="time" setValue={mockFn} value={undefined} />);
  });

  it("render NewDatePicker and check on Press", async () => {
    const mockCurrentFn = jest.fn();
    render(<NewDatePicker placeholder="Test Placeholder" mode="time" setValue={mockCurrentFn} testId="test" testIdModal="modal-test" value={undefined} />);
    // screen.debug();
    expect(() => screen.getByText("Confirm Date")).toThrow(
      'Unable to find an element with text: Confirm Date',
    )
    // act(async () => {


      fireEvent.press(await screen.findByTestId("test"));
    // })
    await waitFor(() => {
      expect(screen.getByText("Confirm Date")).toBeTruthy()
    })
      fireEvent.press(await screen.findByText("Confirm Date"));

    await waitFor(async () => {
      expect(mockCurrentFn).toHaveBeenCalled();
    })
  });
});
