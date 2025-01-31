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

export default function Agenda(robdayLogProps: RobdayLogProps, currentWeatherProps: WeatherProps, forecastWeatherProps: WeatherProps, baseActivityProps: RobDayLogBaseActivityProps[]) {
  const createRobDayLogWithId = createRobdayLog.bind(null, robdayLogProps.robdayLogId);
  const completeRobDayLogWithId = completeRobDayLog.bind(null, robdayLogProps.robdayLogId);
  const createActivityInstanceWithId = createActivityInstance.bind(null, robdayLogProps.robdayLogId);
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

  return (
    <Row
      fillWidth
      transition="macro-medium"
      padding="32"
      gap="64"
      position="relative"
      overflow="hidden"
    >
      <Column
        background="brand-weak"
        // direction="column"
        // overflow="hidden"
        padding="32"
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
            onChange={(date) => setRobDayDate(date)}
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

        <Column>
          {robdayLogProps.aiProps.map((activity, index) => (
            <ActivityInstanceItem
              key={index}
              {...activity}
            />
          ))}
        </Column>
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
        {robdayLogProps.status === "Upcoming" && (
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
        {robdayLogProps.status == "Started" && (
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
        style={{marginBottom: "50%"}}
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
            onSelect={(value) => handleSelect(baseActivityProps.find((activity) => activity.activityId === value ) ?? baseActivityProps[0])}
            value={selectedValue}
            // value=""
          />
        </Column>
            </Dialog>
    </Row>
  )
}