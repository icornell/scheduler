import React from "react";

import {
  render,
  cleanup,
  fireEvent,
  waitForElement,
  getByText,
  getByAltText,
  getByPlaceholderText,
  getAllByTestId,
  queryByText,
  queryByAltText,
  prettyDOM,
} from "@testing-library/react";

import Application from "components/Application";

import axios from "axios";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find((appointment) => queryByText(appointment, "Archie Cohen"));
    // 4. Check that the form is shown.
    fireEvent.click(queryByAltText(appointment, "Edit"));
    // 5. Change the name and interviewer.
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), { target: { value: "Lydia Miller-Jones" }, });
    // 6. Click the "Save" button on the confirmation.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    // 7. Check that the element with the text "Saving" is displayed.
    fireEvent.click(getByText(appointment, "Save"));
    // 8. Wait until the element with the "Add" button is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // 9. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    // 10. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const day = getAllByTestId(container, "day").find((day) => queryByText(day, "Monday"));
    // 11. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find((appointment) => queryByText(appointment, "Archie Cohen"));
    // 4. Check that the form is shown.
    fireEvent.click(queryByAltText(appointment, "Edit"));
    // 5. Change the name and interviewer.
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), { target: { value: "Lydia Miller-Jones" }, });
    // 6. Click the "Save" button on the confirmation.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    // 7. Check that the element with the text "Saving" is displayed.
    fireEvent.click(getByText(appointment, "Save"));
    // 8. Wait until the element with the "Add" button is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // 9. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    await waitForElement(() => getByText(appointment, "Error"));
    // 10. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    expect(getByText(appointment, "Error")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find((appointment) => queryByText(appointment, "Archie Cohen"));
    // 4. Check that the form is shown.
    fireEvent.click(queryByAltText(appointment, "Delete"));
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByText(appointment, "Error"));
    // 8. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    expect(getByText(appointment, "Error")).toBeInTheDocument();
  });
});