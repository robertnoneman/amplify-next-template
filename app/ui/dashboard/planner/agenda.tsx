"use client";

import React, { act, useEffect, useState } from "react";

import {
  Heading,
  Text,
  Button,
  Icon,
  InlineCode,
  Logo,
  Input,
  Avatar,
  AvatarGroup,
  Textarea,
  PasswordInput,
  SegmentedControl,
  SmartLink,
  Dialog,
  Feedback,
  SmartImage,
  Line,
  LogoCloud,
  Background,
  Select,
  useToast,
  Card,
  Fade,
  StatusIndicator,
  DateRangePicker,
  DateRange,
  DatePicker,
  TiltFx,
  HoloFx,
  IconButton,
  TagInput,
  Switch,
  Column,
  Row,
  StyleOverlay,
  Flex,
  DateInput,
  Skeleton,
  Arrow
} from "@/once-ui/components";
import { RobDayLogActivityProps, LocationData, RobdayLogProps, WeatherProps, RobDayLogBaseActivityProps } from "@/app/lib/definitions";
import { getNextRobDay, getWeather, getCurrentLocation, getCurrentRobDay, isRobDay, convertToPastTense, convertToPastTense2 } from "@/app/lib/utils";
import ActivityInstanceItem from "@/app/ui/dashboard/planner/activity-instance";
import { createRobdayLog, completeRobDayLog, createActivityInstance } from "@/app/lib/actions";

export default function Agenda({
  robdayLogProps,
  // currentWeatherProps,
  // forecastWeatherProps,
  baseActivityProps,
  locationData
}: {
  robdayLogProps: RobdayLogProps[],
  // currentWeatherProps: WeatherProps,
  // forecastWeatherProps: WeatherProps,
  baseActivityProps: RobDayLogBaseActivityProps[],
  locationData: LocationData[]
}) {
  const [currentRobdayLogIndex, setCurrentRobdayLogIndex] = useState(robdayLogProps.length - 1);
  const [selectedRobdayLogProp, setSelectedRobdayLogProp] = useState<RobdayLogProps>();
  // const [currentWeatherProps, setCurrentWeatherProps] = useState<WeatherProps>({temperature: 0, conditions: ""});
  // const currentWeatherProps = getWeather(38.9143, -77.0102);
  const [currentWeatherProps, setCurrentWeatherProps] = useState<WeatherProps>({ temperature: 0, conditions: "" });
  const [forecastWeatherProps, setForecastWeatherProps] = useState<WeatherProps>({ temperature: 0, conditions: "" });
  const createRobDayLogWithId = createRobdayLog.bind(null, robdayLogProps[currentRobdayLogIndex].robdayLogId);
  const completeRobDayLogWithId = completeRobDayLog.bind(null, robdayLogProps[currentRobdayLogIndex].robdayLogId);
  const createActivityInstanceWithId = createActivityInstance.bind(null, robdayLogProps[currentRobdayLogIndex].robdayLogId);
  const [selectedDate, setSelectedDate] = useState<Date>(getCurrentRobDay());
  const [robDayDate, setRobDayDate] = useState<Date>(getCurrentRobDay());
  const [isAddActivityDialogOpen, setIsAddActivityDialogOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedValueLabel, setSelectedValueLabel] = useState("Choose an activity");

  const onCreateRobdayLog = () => {
    const date = selectedDate.toISOString().split("T")[0] ?? new Date().toISOString().split("T")[0];
    createRobDayLogWithId(date);
  }

  const onCompleteRobdayLog = () => {
    completeRobDayLogWithId();
  }

  const onAddActivityInstance = () => {
    createActivityInstanceWithId(selectedValue);
  }

  const handleSelect = (activity: RobDayLogBaseActivityProps) => {
    setSelectedValue(activity.activityId);
    setSelectedValueLabel(activity.activityName);
  }

  const handleChangeDate = (date: Date) => {
    setSelectedDate(date);
    setRobDayDate(date);
    // Search for a robday log with the selected date
    const selectedRobdayLogIndex = robdayLogProps.findIndex((robdayLog) => robdayLog.robdayLogDate === date.toISOString().split("T")[0]);
    if (selectedRobdayLogIndex !== -1) {
      console.log("Selected robday log index: ", selectedRobdayLogIndex);
      setCurrentRobdayLogIndex(selectedRobdayLogIndex);
      setSelectedRobdayLogProp(robdayLogProps[selectedRobdayLogIndex]);
    }
    else {
      console.log("No robday log found for selected date: ", date.toISOString().split("T")[0], selectedRobdayLogIndex);
      setSelectedRobdayLogProp(undefined);
    }
  }


  useEffect(() => {
    const getCurrentandForecastWeather = async () => {
      const currentWeather = await getWeather(38.9143, -77.0102);
      setCurrentWeatherProps({
        ...currentWeather,
        temperature: parseFloat(currentWeather.temperature.split("F")[0])
      });
      const forecastWeather = await getWeather(38.9143, -77.0102, robDayDate.toISOString().split("T")[0]);
      // setCurrentWeatherProps(currentWeather);
      setForecastWeatherProps({
        ...forecastWeather,
        temperature: parseFloat(forecastWeather.temperature.split("F")[0])
      });
    }
    getCurrentandForecastWeather();
    // setSelectedRobdayLogProp(robdayLogProps[currentRobdayLogIndex]);
    // handleChangeDate(robDayDate);
  }, []); // When we have longer range forecasts, add robDayDate to the dependency array

  return (
    <Row
      fillWidth
      transition="macro-medium"
      // padding="32"
      gap="64"
      position="relative"
      overflow="hidden">
      <Column
        background="brand-weak"
        // direction="column"
        // overflow="hidden"
        padding="12"
        gap="20"
        border="neutral-medium"
        radius="xl"
        fillWidth
        fillHeight>
        <Line height={0.25} />
        <Heading variant="display-default-m" align="center">
          ROBDAY AGENDA
        </Heading>
        <Line height={0.25} />
        <Column fillWidth justifyContent="space-between" alignItems="center" mobileDirection="column" gap="2">
          <DateInput
            id="date-input"
            label="Date"
            // value={getNextRobDay()}
            value={robDayDate}
            // onChange={(date) => setRobDayDate(date)}
            onChange={(date) => handleChangeDate(date)}
          >
          </DateInput>
          <Row padding="2" justifyContent="space-between" alignItems="center" fillWidth>
            <Text variant="body-default-xs">
              Current Weather: <br></br>
              {currentWeatherProps.temperature}°F, {currentWeatherProps.conditions}.
            </Text>
            <Line width={0.1} vertical />
            <Text variant="body-default-xs" align="right">
              Forcast Weather: <br></br>
              {forecastWeatherProps.temperature}°F, {forecastWeatherProps.conditions?.split(".")[0]}°F.
            </Text>
          </Row>
          {/* <Icon
                    name="calendarDays"
                    size="l"
                    onBackground="neutral-medium"
                  /> */}
        </Column>
        {!selectedRobdayLogProp && (
          <Row fillWidth justifyContent="center">
            <Button
              // onClick={() => checkRobDayLogForActivityInstances(robDayLogId? robDayLogId : "")}
              variant="primary"
              size="m"
              id="trigger"
            >
              <Row justifyContent="center" alignItems="center">
                CREATE ROBDAY FOR {robDayDate.toLocaleDateString()}
                <Arrow
                  trigger="#trigger"
                  color="onBackground"
                />
              </Row>
            </Button>
          </Row>
        )}
        {selectedRobdayLogProp && (
          <Column>
            {robdayLogProps[currentRobdayLogIndex].aiProps.map((activity, index) => (
              <ActivityInstanceItem
                key={index}
                activityInstanceProps={activity}
                locationData={locationData}
              />
            ))}
          </Column>
        )}
        {selectedRobdayLogProp && (
          <Row fillWidth justifyContent="center">
            <Button
              onClick={() => setIsAddActivityDialogOpen(true)}
              variant="tertiary"
              size="m"
              id="trigger"
            >
              <Row justifyContent="center" alignItems="center">
                ADD NEW ACTIVITY
                <Arrow
                  trigger="#trigger"
                  color="onBackground"
                />
              </Row>
            </Button>
          </Row>
        )}

        {selectedRobdayLogProp && robdayLogProps[currentRobdayLogIndex].status === "Upcoming" && (
          <Row fillWidth justifyContent="center">
            <Button
              onClick={() => onCreateRobdayLog()}
              variant="primary"
              size="m"
              id="trigger"
            >
              <Row justifyContent="center" alignItems="center">
                START ROB DAY
                <Arrow
                  trigger="#trigger"
                  color="onBackground"
                />
              </Row>
            </Button>
          </Row>
        )}
        {selectedRobdayLogProp && robdayLogProps[currentRobdayLogIndex].status == "Started" && (
          <Row fillWidth justifyContent="center">
            <Button
              onClick={() => onCompleteRobdayLog()}
              variant="primary"
              size="m"
              id="trigger"
            >
              <Row justifyContent="center" alignItems="center">
                END ROB DAY
                <Arrow
                  trigger="#trigger"
                  color="onBackground"
                />
              </Row>
            </Button>
          </Row>
        )}
      </Column>
      <Dialog
        isOpen={isAddActivityDialogOpen}
        onClose={() => setIsAddActivityDialogOpen(false)}
        title="Add Robday Activity"
        description=""
        style={{ marginBottom: "50%" }}
        // onHeightChange={(height) => setFirstDialogHeight(height)}
        footer={
          <>
            <Button variant="secondary" onClick={() => onAddActivityInstance()}>
              ADD
            </Button>
          </>
        }
      >
        <Column >
          <Text variant="body-default-s">
            Ability to add a new activity if it hasn't been created yet here coming soon...
          </Text>
          <Select
            searchable
            id="activity"
            label={selectedValueLabel}
            minHeight={300}
            options={baseActivityProps.map((activity) => {
              return { value: activity.activityId, label: activity.activityName, description: activity.activityDescription }
            })}
            // onChange={(value) => setSelectedValue(activities.find((activity) => activity.id === value.target.value)?.id ?? "")}
            // onChange={(value) => handleSelect(activities.find((activity) => activity.name === value.target.value ) ?? activities[0])}
            // onSelect={(value) => printSelect(value)}
            onSelect={(value) => handleSelect(baseActivityProps.find((activity) => activity.activityId === value) ?? baseActivityProps[0])}
            value={selectedValue}
          // value=""
          />
        </Column>
      </Dialog>
    </Row>
  )
}