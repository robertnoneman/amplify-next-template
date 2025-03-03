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
  Arrow,
  Grid
} from "@/once-ui/components";
import { CodeBlock, MediaUpload } from "@/once-ui/modules";
import Link from 'next/link';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import clsx from 'clsx';
import { roboto } from '@/app/ui/fonts';
import { usePathname } from 'next/navigation';
import { getNextRobDay, getWeather, getCurrentLocation, getCurrentRobDay, isRobDay, convertToPastTense, convertToPastTense2 } from "@/app/lib/utils";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json"
import { getUrl } from 'aws-amplify/storage';
import RobdayLog from "@/app/ui/dashboard/robday-log";
import { uploadData } from 'aws-amplify/storage';


Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function Page() {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedValueLabel, setSelectedValueLabel] = useState("Choose an activity");
  const [selectedLocationValue, setSelectedLocationValue] = useState("");
  const [selectedLocationValueLabel, setSelectedLocationValueLabel] = useState("Choose a location");
  const [selectedRange, setSelectedRange] = useState<DateRange>();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [robDayDate, setRobDayDate] = useState<Date>(getCurrentRobDay());
  const [startTimeString, setStartTimeString] = useState<string>("Pending");
  const [endTimeString, setEndTimeString] = useState<string>("Pending");
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isAddActivityDialogOpen, setIsAddActivityDialogOpen] = useState(false);
  const [isCreateNewLocationDialogOpen, setIsCreateNewLocationDialogOpen] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationAddress, setNewLocationAddress] = useState("");
  const [firstDialogHeight, setFirstDialogHeight] = useState<number>();
  // const { addToast } = useToast();
  const [activities, setActivities] = useState<Array<Schema["Activity"]["type"]>>([]);
  const [locations, setLocations] = useState<Array<Schema["Location"]["type"]>>([]);
  const [selectedLocation, setSelectedLocation] = useState<Schema["Location"]["type"]>();
  const [activityInstances, setActivityInstances] = useState<Array<Schema["ActivityInstance"]["type"]>>([]);
  const [selectedActivities, setSelectedActivities] = useState<Array<Schema["Activity"]["type"]>>([]);
  const [selectedActivityInstances, setSelectedActivityInstances] = useState<Array<Schema["ActivityInstance"]["type"]>>([]);
  const [removedActivity, setRemovedActivity] = useState<Schema["Activity"]["type"]>();
  const [removedActivityInstance, setRemovedActivityInstance] = useState<Schema["ActivityInstance"]["type"]>();
  const [editededActivity, setEditedActivity] = useState<Schema["Activity"]["type"]>();
  const [editedActivityInstance, setEditedActivityInstance] = useState<Schema["ActivityInstance"]["type"]>();
  const [completedActivity, setCompletedActivity] = useState<Schema["Activity"]["type"]>();
  const [completedActivityInstance, setCompletedActivityInstance] = useState<Schema["ActivityInstance"]["type"]>();
  const [addedActivity, setAddedActivity] = useState<Schema["Activity"]["type"]>();
  const [addedLocation, setAddedLocation] = useState<Schema["Location"]["type"]>();
  const [addedActivityInstance, setAddedActivityInstance] = useState<Schema["ActivityInstance"]["type"]>();

  const [activityInstanceCost, setActivityInstanceCost] = useState<number>();
  const [activityInstanceRating, setActivityInstanceRating] = useState<number>();
  const [robDayLog, setRobDayLog] = useState<Schema["Robdaylog"]["type"]>();
  const [robDayLogId, setRobDayLogId] = useState<string>();
  const [robDayLogNumber, setRobDayLogNumber] = useState<number>();
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [archived, setArchived] = useState(false);
  // Because I'm young and dumb and scared
  const [failSafeBool, setFailSafeBool] = useState(false);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [newImageUrls, setNewImageUrls] = useState<Record<string, string[]>>({}); // For new images uploaded
  const [forecastTemp, setForecastTemp] = useState<string>();
  const [forecastWeather, setForecastWeather] = useState<string>();
  const [currentTemp, setCurrentTemp] = useState<string>();
  const [currentWeather, setCurrentWeather] = useState<string>();
  const [currentLat, setCurrentLat] = useState<number>();
  const [currentLong, setCurrentLong] = useState<number>();
  const [activityInstanceNotes, setActivityInstanceNotes] = useState<string>("");
  const { addToast } = useToast();

  const handleSelect = (activity: Schema["Activity"]["type"]) => {
    console.log("Selected option:", activity.name);
    setSelectedValue(activity.name ?? "");
    setSelectedValueLabel(activity.location ?? "");
    setAddedActivity(activity);
  };

  const handleSelectLocation = (location: Schema["Location"]["type"]) => {
    console.log("Selected option:", location.name);
    setSelectedLocationValue(location.name ?? "");
    setSelectedLocationValueLabel(location.address ?? "");
    setSelectedLocation(location);
  }

  const handleSelectedDateChange = (date: Date) => {
    console.log("Selected date:", date);
    setSelectedDate(date);
    setRobDayDate(date);
    changeRobDayLog(date);
  }

  const printSelect = (value: string) => {
    setSelectedValue(value);
    setSelectedValueLabel(value);
    console.log("Selected value:", value);
  }

  const handleUploadData = async (file: File): Promise<void> => {
      await uploadData({
        path: `picture-submissions/${file.name}`, 
        data: file
      });
      addToast({
        message: "Upload successful",
        variant: "success",
      });
      // setActivityImage(`picture-submissions/${file.name}`)
    }

  const getImageUrl = async (key: string): Promise<string> => {
    // const url = getUrl({
    //     path: key
    // });
    const url = `https://amplify-d2e7zdl8lpqran-ma-robdayimagesbuckete97c22-bwldlxhxdd4t.s3.us-east-1.amazonaws.com/${key}`;
      // return (await url).url.toString();
      return url;
    }

  function listActivities() {
    const urlDict: Record<string, string> = {};
    client.models.Activity.observeQuery().subscribe({
      next: async (data) => {
        setActivities([...data.items]);
        const urls = await Promise.all(data.items.map(async (activity) => {
          if (activity.image && activity.isOnNextRobDay) {
            urlDict[activity.id] = await getImageUrl(activity.image);
            return await getImageUrl(activity.image);
          }
          return "";
        }));
        // setUrls(urls);
        setUrls(urlDict);
        const selected = data.items.filter((activity) => activity.isOnNextRobDay);
        setSelectedActivities(selected);
      },
    })
  }

  function listLocations() {
    client.models.Location.observeQuery().subscribe({
      next: async (data) => {
        setLocations([...data.items]);
      },
    })
  }

  function listActivityInstances() {
    client.models.ActivityInstance.observeQuery().subscribe({
      next: async (data) => {
        setActivityInstances([...data.items]);
        const selected = data.items.filter((activityInstance) => activityInstance.isOnNextRobDay).filter((activityInstance) => activityInstance.status !== "Completed");
        // selected.filter((activityInstance) => activityInstance.robdaylogId === robDayLogId);
        setSelectedActivityInstances(selected);
      },
    })
  }

  async function checkRobDayLogForActivityInstances(id: string) {
    if (!failSafeBool) {
      console.log("Checking RobDayLog for Activity Instances");
      setFailSafeBool(true);
      if (!id) {
        console.log("No RobDayLog ID found. Creating new Robday Log...");
        createRobdayLog();
        return;
      }
      const myRobDayLog = await client.models.Robdaylog.get({ id: id });
      if (myRobDayLog.data) {
        if (selectedActivityInstances.length > 0) {
          // Check each activity instance to see that it has been assigned the current robDayLog.id, if not, assign it.
          selectedActivityInstances.forEach((activityInstance) => {
            if (activityInstance.robdaylogId !== myRobDayLog.data?.id) {
              const result = client.models.ActivityInstance.update({ id: activityInstance.id, robdaylogId: myRobDayLog.data?.id });
              console.log("Activity Instance updated: ", result);
            }
          });
        }
        else {
          console.log("No Activity Instances found");
        }
        if (selectedActivities.length > 0) {
          // Check if the current robDayLog has any activities assigned to it, if not, assign them.
          selectedActivities.forEach(async (activity) => {
            const activityRobDayLogs = await activity.robdaylogs();
            if (activityRobDayLogs.data.length > 0) {
              return;
              const foundRobDayLog = activityRobDayLogs.data.find((robDayLog) => robDayLog.robdaylogId === id);
              if (!foundRobDayLog) {
                const result = client.models.RobdaylogActivity.create({ robdaylogId: id, activityId: activity.id });
                console.log("Robday Log Activity created: ", result);
              }
            }
            else {
              const result = client.models.RobdaylogActivity.create({ robdaylogId: id, activityId: activity.id });
              console.log("Robday Log Activity created: ", result);
            }
          });
        }
        else {
          console.log("No Activities found");
        }
      }
      else {
        console.log("No RobDayLog found. Creating a new one...");
        createRobdayLog();
      }
    }
  }

  function timestampToHoursMinSecString(timestamp: number) {
    const date = new Date(timestamp);
    const hours = date.getHours()
    const hoursString = hours > 12 ? (hours - 12).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) : hours.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    const minutes = date.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    const seconds = date.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    return `${hoursString}:${minutes}:${seconds}`;
  }

  async function changeRobDayLog(date: Date) {
    const logs = await client.models.Robdaylog.list();
    const foundLog = logs.data.find((log) => log.date === date.toISOString().split("T")[0]);
    if (foundLog) {
      setRobDayLog(foundLog);
      setRobDayLogId(foundLog.id);
      if (foundLog.startTime) {
        const startTimeString = timestampToHoursMinSecString(foundLog.startTime);
        setStartTimeString(startTimeString);
      }
      else {
        setStartTimeString("Pending");
      }
      if (foundLog.endTime) {
        const endTimeString = timestampToHoursMinSecString(foundLog.endTime);
        setEndTimeString(endTimeString);
      }
      else {
        setEndTimeString("Pending");
      }
    }
    else {
      setRobDayLog(undefined);
      setRobDayLogId(undefined);
      setStartTimeString("Pending");
      setEndTimeString("Pending");
    }
  }

  function listRobDayLogs() {
    var myRobDayDate = getCurrentRobDay();
    if (robDayDate) {
      myRobDayDate = robDayDate;
    }
    client.models.Robdaylog.observeQuery().subscribe({
      next: async (data) => {
        setRobDayLogNumber(data.items.length + 1);
        console.log("Number of Robday Logs: ", data.items.length);
        var foundRobDayLog = data.items.filter((robdayLog) => robdayLog.date === myRobDayDate.toISOString().split("T")[0]);
        if (foundRobDayLog.length > 0) {
          setRobDayLog(foundRobDayLog[0]);
          console.log("Robday Log found for date: ", myRobDayDate.toISOString().split("T")[0], foundRobDayLog[0].date);
          setRobDayLogId(foundRobDayLog[0].id);
          // Create string to display as hours minutes seconds
          if (robDayLog?.startTime) {
            const startTimeString = timestampToHoursMinSecString(robDayLog?.startTime ?? 0);
            setStartTimeString(startTimeString);
          }
          if (robDayLog?.endTime) {
            const endTimeString = timestampToHoursMinSecString(robDayLog?.endTime ?? 0);
            setEndTimeString(endTimeString);
          }

          setStarted(foundRobDayLog[0].status === "Started");
          if (foundRobDayLog[0].endTime) {
            if (foundRobDayLog[0].endTime > 0) {
              setEnded(true);
            }
          }
        }
        else {
          // setRobDayLog(undefined);
          console.log("No Robday Log found for date: ", myRobDayDate.toISOString().split("T")[0]);
          setStarted(false);
          // createRobdayLog();
        }
      },
    })
  }

  function onRemoveActivity(activity: Schema["Activity"]["type"]) {
    setRemovedActivity(activity);
    setIsFirstDialogOpen(true);
  }

  function onRemoveActivityInstance(activityInstance: Schema["ActivityInstance"]["type"]) {
    setRemovedActivityInstance(activityInstance);
    setIsFirstDialogOpen(true);
  }

  function onEditActivity(activity: Schema["Activity"]["type"]) {
    setEditedActivity(activity);
    setIsSecondDialogOpen(true);
  }

  function onEditActivityInstance(activityInstance: Schema["ActivityInstance"]["type"]) {
    setEditedActivityInstance(activityInstance);
    if (activityInstance.locationId) {
      const location = locations.find((location) => location.id === activityInstance.locationId);
      setSelectedLocation(location);
      setSelectedLocationValue(location?.name ?? "Choose a location");
      setSelectedLocationValueLabel(location?.name ?? "Choose a location");
    }
    // activityInstance.locationId ? setSelectedLocationValueLabel(activityInstance.locationId) : setSelectedLocationValueLabel("Choose a location");
    setIsSecondDialogOpen(true);
  }

  function onAddActivity(activity: Schema["Activity"]["type"]) {
    setAddedActivity(activity);
    addedActivity ? addedActivity.isOnNextRobDay = true : null;
    addedActivity ? client.models.Activity.update({ ...addedActivity }) : null;
    setAddedActivity(undefined);
    // setIsSecondDialogOpen(true);
  }

  function onCompleteActivity(activity: Schema["Activity"]["type"]) {
    setCompletedActivity(activity);
    setIsCompleteDialogOpen(true);
  }

  function onCompleteActivityInstance(activityInstance: Schema["ActivityInstance"]["type"]) {
    setCompletedActivityInstance(activityInstance);
    setIsCompleteDialogOpen(true);
  }

  function removeActivity() {
    removedActivity ? removedActivity.isOnNextRobDay = false : null;
    const activInstance = selectedActivityInstances.find((activityInstance) => activityInstance.displayName === removedActivity?.name);
    if (activInstance) {
      console.log("Activity Instance found: ", activInstance);
      setRemovedActivityInstance(activInstance);
      const result = client.models.ActivityInstance.delete({ id: activInstance.id });
      console.log("Activity Instance removed: ", result);
      // removeActivityInstance(activInstance);
    }
    else {
      if (removedActivityInstance) {
        removeActivityInstance(removedActivityInstance);
      }
      else {
        console.log("Activity Instance not found");
      }
    }
    removedActivity ? client.models.Activity.update({ ...removedActivity }) : null;
    addToast({
      message: "Activity removed",
      variant: "success",
    });
    setRemovedActivity(undefined);
    setRemovedActivityInstance(undefined);
    setIsFirstDialogOpen(false);
  }

  function removeActivityInstance(activityInstance: Schema["ActivityInstance"]["type"]) {
    const result = client.models.ActivityInstance.delete({ id: activityInstance.id });

    console.log("Activity Instance removed: ", result);
    addToast({
      message: "Activity removed",
      variant: "success",
    });
    if (removedActivity) {
      const activ = selectedActivities.find((activity) => activity.id === removedActivity.id);
      if (activ) {
        activ.isOnNextRobDay = false;
        selectedActivities[selectedActivities.indexOf(activ)] = activ;
      }
    }
    setRemovedActivityInstance(undefined);
    setIsFirstDialogOpen(false);
  }

  function editActivity() {
    // editededActivity ? client.models.Activity.update({ ...editededActivity }) : null;
    const activInst = selectedActivityInstances.find((activityInstance) => activityInstance.displayName === editededActivity?.name);
    if (activInst) {
      console.log("Activity Instance found: ", activInst);
      setEditedActivityInstance(activInst);
      editActivityInstance(activInst);
    }
    else {
      if (editedActivityInstance) {
        editActivityInstance(editedActivityInstance);
      }
      else {
        console.log("Activity Instance not found");
      }
    }
    // editededActivity ? editActivityInstance() : null;
    setIsSecondDialogOpen(false);
  }

  function editActivityInstance(activityInstance: Schema["ActivityInstance"]["type"]) {
    if (activityInstance) {
      // editedActivityInstance.date = robDayDate ? robDayDate.toDateString() : "";
      console.log("Selected location: ", selectedLocation);
      if (selectedLocation) {
        activityInstance.locationId = selectedLocation.id;
      }
      if (activityInstanceNotes) {
        if (activityInstance.notes) {
          activityInstance.notes.push(activityInstanceNotes);
        } else {
          activityInstance.notes = [activityInstanceNotes];
        }
      }
      // const test = await client.models.ActivityInstance.get({ id: activityInstance.id });
      // console.log("Activity Instance found: ", test);
      // console.log("Location of test: ", test.location().data);
      // const result = client.models.ActivityInstance.update({ ...activityInstance });
      if (selectedLocation) {
        const result = client.models.ActivityInstance.update({ id: activityInstance.id, locationId: selectedLocation.id });
        console.log("Activity Instance updated: ", result);
      } 

      const updateResult = client.models.ActivityInstance.update({ id: activityInstance.id, notes: activityInstance.notes });
      console.log("Activity Instance notes updated: ", updateResult);
      addToast({
        message: "Activity updated",
        variant: "success",
      });
    }
    else {
      console.log("No Activity Instance found for som efucking reason... ", activityInstance);
      addToast({
        message: "Activity not found",
        variant: "danger",
      });
    }
    if (editededActivity) {
      const activ = selectedActivities.find((activity) => activity.id === editededActivity.id);
      if (activ) {
        activ.location = selectedLocation ? selectedLocation.name : "";
        selectedActivities[selectedActivities.indexOf(activ)] = activ;
      }
    }
    setEditedActivityInstance(undefined);
    setEditedActivity(undefined);
    setSelectedLocation(undefined);
    setIsSecondDialogOpen(false);
    setSelectedLocationValue("");
    setSelectedLocationValueLabel("Choose a location");
    setActivityInstanceNotes("");
  }

  const addPhotoToActivityInstance = async (activityInstance: Schema["ActivityInstance"]["type"], file: File): Promise<void> => {
    handleUploadData(file);
    const key = `picture-submissions/${file.name}`;
    const images = activityInstance.images ? activityInstance.images : [];
    images.push(key);
    const result = client.models.ActivityInstance.update({ id: activityInstance.id, images: images });
    console.log("Activity Instance updated: ", result);
    addToast({
      message: "Image uploaded",
      variant: "success",
    });
    const url = await getImageUrl(key);
    if (url) {
      const myImageUrls = { ...newImageUrls };
      if (myImageUrls[activityInstance.id]) {
        myImageUrls[activityInstance.id].push(url);
      }
      else {
        myImageUrls[activityInstance.id] = [url];
      }
      setNewImageUrls(myImageUrls);
      const newUrlsDict = { ...urls };
      newUrlsDict[activityInstance.id] = url;
      setUrls(newUrlsDict);
    }
  }

  function addActivity() {
    addedActivity ? addedActivity.isOnNextRobDay = true : null;
    addedActivity ? client.models.Activity.update({ ...addedActivity }) : null;
    addedActivity ? createActivityInstance({ ...addedActivity}) : null;
    addToast({
      message: "Activity added",
      variant: "success",
    });
    setAddedActivity(undefined);
    setIsAddActivityDialogOpen(false);
    setSelectedValue("");
    setSelectedValueLabel("Choose an activity");
  }

  function createActivityInstance(activity: Schema["Activity"]["type"]) {
    const newActivityInstance = {
      date: robDayDate ? robDayDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      displayName: activity.name,
      startTime: 0,
      endTime: 0,
      totalTime: 0,
      notes: [activity.description? activity.description : ""],
      weatherCondition: "",
      temperature: 0,
      rating: 0,
      loe: 0,
      cost: 0,
      images: [activity.image? activity.image : ""],
      activityId: activity.id,
      locationId: "pending",
      robdaylogId: robDayLog? robDayLog.id : "pending",
      activity: activity,
      completed: false,
      isOnNextRobDay: true,
    };
    const activityInstance = client.models.ActivityInstance.create({ ...newActivityInstance });
    // activityInstance ? setAddedActivityInstance(activityInstance) : setAddedActivityInstance(undefined);
    console.log("Activity Instance created: ", activityInstance);
  }

  function startActivity(activity: Schema["ActivityInstance"]["type"]) {
    const startTime = new Date().getTime();
    const temp = Number(currentTemp?.split(" F")[0]);
    const result = client.models.ActivityInstance.update({ id: activity.id, status: "InProgress", startTime: startTime, weatherCondition: currentWeather, temperature: temp, robdaylogId: robDayLog?.id });
    console.log("Activity Instance started: ", startTime, result);
    addToast({
      message: "Activity started",
      variant: "success",
    });
  }

  function stopActivity(activity: Schema["ActivityInstance"]["type"]) {
    const endTime = new Date().getTime();
    var duration = 0;
    if (activity.startTime) {
      duration = endTime - activity.startTime;
    }
    const result = client.models.ActivityInstance.update({ id: activity.id, status: "Paused", endTime: endTime, totalTime: duration });
    console.log("Activity Instance stopped: ", endTime, result);
    addToast({
      message: "Activity stopped",
      variant: "success",
    });
  }

  function resetActivityTime(activity: Schema["ActivityInstance"]["type"]) {
    const result = client.models.ActivityInstance.update({ id: activity.id, startTime: 0, endTime: 0, totalTime: 0, status: null });
    console.log("Activity Instance reset: ", result);
    addToast({
      message: "Activity reset",
      variant: "success",
    });
  }

  function completeActivity() {
    // completedActivity ? completedActivity.isOnNextRobDay = false : null;
    const newCount = completedActivity ? completedActivity.count ? completedActivity.count + 1 : completedActivity.count = 1 : 1;
    completedActivity ? completedActivity.count? completedActivity.count = newCount : completedActivity.count = 1 : 1;
    completedActivity ? client.models.Activity.update({ ...completedActivity }) : null;
    setCompletedActivity(undefined);
    setIsCompleteDialogOpen(false);
    completeActivityInstance();
  }

  function completeActivityInstance() {
    // completedActivityInstance ? completedActivityInstance.isOnNextRobDay = false : null;
    completedActivityInstance && completedActivityInstance.displayName ? completedActivityInstance.displayName = convertToPastTense2(`${completedActivityInstance.displayName.toLocaleLowerCase()}`) : null;
    console.log("Completed Activity Instance: ", completedActivityInstance?.displayName);
    completedActivityInstance ? completedActivityInstance.completed = true : null;
    completedActivityInstance ? completedActivityInstance.status = "Completed" : null;
    if (completedActivityInstance && robDayLog) {
      completedActivityInstance.robdaylogId = robDayLog.id;
    }
    completedActivityInstance ? client.models.ActivityInstance.update({ ...completedActivityInstance }) : null;
    setCompletedActivityInstance(undefined);
    setIsCompleteDialogOpen(false);
    addToast({
      message: "Activity completed",
      variant: "success",
    });
  }

  async function createRobdayLog() {
    setStarted(true);
    const startTime = new Date().getTime();
    const selectedActivityInstanceIds = selectedActivityInstances.map((activityInstance) => activityInstance.id);
    const newRobdayLog = {
      date: robDayDate ? robDayDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      robDayNumber: robDayLogNumber,
      startTime: startTime,
      weatherCondition: currentWeather,
      temperature: Number(currentTemp?.split(" F")[0]),
      // activities: activities,
      // locations: [],
      activityInstances: selectedActivityInstanceIds,
      status: "Upcoming" as "Upcoming" | "Started" | "Completed",
      // notes: [],
    };
    const myRobdayLog = await client.models.Robdaylog.create({ ...newRobdayLog });
    console.log("Robday Log created: ", myRobdayLog);
    if (myRobdayLog.data) {
      setRobDayLog(myRobdayLog.data);
      setRobDayLogId(myRobdayLog.data.id);
    }
    selectedActivityInstanceIds.forEach((activityInstanceId) => {
      const result = client.models.ActivityInstance.update({ id: activityInstanceId, robdaylogId: myRobdayLog.data?.id });
      console.log("Activity Instance updated: ", result);
    });
    addToast({
      message: "Robday Log created",
      variant: "success",
    });
  }

  async function startRobDay() {
    setStarted(true);
    const result = await client.models.Robdaylog.update({ id: robDayLogId ?? "", status: "Started"})
    console.log("Robday started!", result)
    listRobDayLogs();
    addToast({
      message: "Robday started",
      variant: "success",
    });
  }

  function updateRobdayLog() {
    if (robDayLog) {
      const updatedRobDayLog = {
        id: robDayLog.id,
        robDayNumber: robDayLogNumber,
        date: robDayDate ? robDayDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        startTime: robDayLog.startTime,
        weatherCondition: robDayLog.weatherCondition,
        temperature: robDayLog.temperature,
        activities: robDayLog.activities,
        locations: robDayLog.locations,
        activityInstances: activityInstances ? activityInstances : [],
        notes: robDayLog.notes,
      };
      const result = client.models.Robdaylog.update({ ...updatedRobDayLog });
      console.log("Robday Log updated: ", result);
    }
  }

  function completeRobDayLog() {
    if (robDayLog) {
      const endTime = new Date().getTime();
      const duration = endTime - (robDayLog.startTime ?? 0);
      const updatedRobDayLog = {
        id: robDayLog.id,
        date: robDayDate ? robDayDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        startTime: robDayLog.startTime,
        endTime: endTime,
        totalTime: duration,
        weatherCondition: robDayLog.weatherCondition,
        temperature: robDayLog.temperature,
        activities: robDayLog.activities,
        locations: robDayLog.locations,
        activityInstances: activityInstances ? activityInstances : [],
        notes: robDayLog.notes,
      };
      selectedActivities.forEach((activity) => {
        activity.isOnNextRobDay = false;
        const result = client.models.Activity.update({ ...activity });
        console.log("Activity completed: ", result);
      });
      selectedActivityInstances.forEach((activityInstance) => {
        activityInstance.isOnNextRobDay = false;
        activityInstance.completed = true;
        const result = client.models.ActivityInstance.update({ ...activityInstance });
        console.log("Activity Instance completed: ", result);
      });
      const result = client.models.Robdaylog.update({ id: robDayLog.id, endTime: endTime, totalTime: duration, status: "Completed" });
      console.log("Robday Log completed: ", result);
      addToast({
        message: "Robday completed",
        variant: "success",
      });
    }
  }

  const getCurrentandForecastWeather = async () => {
    const myDate = robDayDate? robDayDate : getCurrentRobDay();
    if (myDate) {
      const forecast = await getWeather(38.9143, -77.0102, myDate.toISOString().split("T")[0]);
      console.log("Forecast Weather: ", forecast);
      setForecastTemp(forecast.temperature);
      setForecastWeather(forecast.conditions);
    }
    const current = await getWeather(38.9143, -77.0102);
    console.log("Current Weather: ", current);
    setCurrentTemp(current.temperature);
    setCurrentWeather(current.conditions);

    console.log("Forecast Temp: ", forecastTemp);
    console.log("Forecast Weather: ", forecastWeather);
    console.log("Current Temp: ", currentTemp);
    console.log("Current Weather: ", currentWeather);
  }

  function createNewLocation() {
    const newLocation = {
      name: newLocationName,
      address: newLocationAddress,
    };
    const location = client.models.Location.create({ ...newLocation });
    console.log("Location created: ", location);
    addToast({
      message: "Location created",
      variant: "success",
    });
    // setAddedLocation(location);
    // setSelectedLocation(location);
    // setSelectedLocationValue("");
    // setSelectedLocationValueLabel("Choose a location");
    setIsCreateNewLocationDialogOpen(false);
  }

  function handleCreateNewLocation() {
    setSelectedLocationValue("");
    setSelectedLocationValueLabel("Choose a location");
    setIsCreateNewLocationDialogOpen(true);
  }


  useEffect(() => {
    listActivities();
    listLocations();
    listActivityInstances();
    // setRobDayDate(getCurrentRobDay());
    listRobDayLogs();
    getCurrentandForecastWeather();
  }, []);

  const pathname = usePathname();
  return (
    <Column fillWidth paddingY="80" paddingX="s" alignItems="center" flex={1}>
      <Fade
        zIndex={3}
        pattern={{
          display: true,
          size: "4",
        }}
        position="fixed"
        top="0"
        left="0"
        to="bottom"
        height={5}
        fillWidth
        blur={0.25}
      />
      <Row position="fixed" top="0" fillWidth justifyContent="center" zIndex={3}>
        <Row
          data-border="rounded"
          justifyContent="space-between"
          maxWidth="l"
          paddingRight="64"
          paddingLeft="32"
          paddingY="20"
        >
          {/* <Logo size="m" icon={false} href="https://itsrobday.com" />
          <Row gap="12" hide="s">
            <Button
              href="https://github.com/robertnoneman/amplify-next-template"
              prefixIcon="github"
              size="s"
              label="GitHub"
              weight="default"
              variant="tertiary"
            />
            <StyleOverlay top="20" right="24" />
          </Row> */}
          <Row gap="16" show="s" alignItems="center" paddingRight="24">
            <IconButton
              href="https://github.com/robertnoneman/amplify-next-template"
              icon="github"
              variant="tertiary"
            />
            <StyleOverlay top="20" right="24" />
          </Row>
        </Row>
      </Row>
      <Column
        overflow="hidden"
        as="main"
        maxWidth="l"
        position="relative"
        radius="xl"
        alignItems="center"
        border="neutral-alpha-weak"
        fillWidth
      >
        <Column
          fillWidth
          alignItems="center"
          gap="48"
          radius="xl"
          paddingTop="80"
          position="relative"
          background="surface"
        >
          {/* <Background
            mask={{
              x: 0,
              y: 48,
            }}
            position="absolute"
            grid={{
              display: true,
              width: "0.25rem",
              color: "neutral-alpha-medium",
              height: "0.25rem",
            }}
          /> */}
          <Background
            mask={{
              x: 80,
              y: 0,
              radius: 100,
            }}
            position="absolute"
            gradient={{
              display: true,
              tilt: -35,
              height: 50,
              width: 75,
              x: 100,
              y: 40,
              colorStart: "accent-solid-medium",
              colorEnd: "static-transparent",
            }}
          />
          <Background
            mask={{
              x: 50,
              y: 0,
              radius: 50,
              cursor: true
            }}
            position="absolute"
            gradient={{
              display: true,
              opacity: 100,
              tilt: 0,
              height: 100,
              width: 100,
              x: 50,
              y: 0,
              colorStart: "brand-solid-strong",
              colorEnd: "static-transparent",
            }}
          />
          <Column fillWidth alignItems="center" gap="32" padding="32" position="relative">
            <Heading wrap="balance" variant="display-default-l" align="center" marginBottom="16">
              On the next Robday...
            </Heading>
          </Column>

          <Row
            padding="32"
            fillWidth
            gap="64"
            position="relative"
            mobileDirection="column"
            alignItems="center"
          >
            <Column
              fillWidth
              background="surface"
              radius="xl"
              border="neutral-medium"
              overflow="hidden"
              padding="32"
              gap="40"
              position="relative"
            >
              <Row fillWidth justifyContent="center" mobileDirection="column">
                {/* <DateRangePicker
                  data-scaling="100"
                  size="l"
                  fitWidth
                  gap="40"
                  mobileDirection="column"
                  onChange={(range) => setSelectedRange(range)}
                  value={selectedRange}
                /> */}
                <DatePicker
                  data-scaling="100"
                  size="l"
                  fitWidth
                  gap="40"
                  mobileDirection="column"
                  // onChange={(date) => setSelectedDate(date)}
                  onChange={(date) => handleSelectedDateChange(date)}
                  value={selectedDate}
                />
              </Row>
            </Column>
          </Row>

          {/* AGENDA CARD */}
          <Row
            fillWidth 
            transition="macro-medium"
            padding="12"
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
              <Line height={0.25}/>
              <Heading variant="display-default-m" align="center">
                ROBDAY AGENDA
              </Heading>
              <Line height={0.25}/>
              <Column fillWidth justifyContent="space-between" alignItems="center" mobileDirection="column" gap="2">
                <DateInput
                  id="date-input"
                  label="Date"
                  // value={getNextRobDay()}
                  value={robDayDate}
                  onChange={(date) => handleSelectedDateChange(date)}
                  >
                </DateInput>
                <Row padding="2" justifyContent="space-between" alignItems="center" fillWidth>
                <Text variant="body-default-xs">
                  Current Weather: <br></br>
                  {currentTemp?.split(" F")[0]}°F, {currentWeather}
                </Text>
                <Line width={0.1} vertical/>
                <Text variant="body-default-xs" align="right">
                  Forcast Weather: <br></br>
                  {forecastTemp?.split(" F")[0]}°F, {forecastWeather?.split(".")[0]}
                </Text>
                </Row>
                {/* <Icon
                  name="calendarDays"
                  size="l"
                  onBackground="neutral-medium"
                /> */}
              </Column>

              <Line height={0.1}/>
              <Column fillWidth>
                <Grid columns="2">
                  <Text variant="body-default-xs">
                    Start Time:
                  </Text>
                  <Text variant="body-default-xs" align="right">
                    End Time:
                  </Text>
                  <Text variant="body-default-xs">
                    {startTimeString}
                  </Text>
                  <Text variant="body-default-xs" align="right">
                    {endTimeString}
                  </Text>
                </Grid>
              </Column>
              {!robDayLog && (
                <Row fillWidth justifyContent="center">
                  <Button
                    onClick={() => checkRobDayLogForActivityInstances(robDayLogId? robDayLogId : "")}
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
              <Line height={0.1}/>
              
              <Column>
                {selectedActivityInstances.map((activityInstance, index) => (
                  <Column key={`${activityInstance.id}`} fillWidth>
                    {activityInstance.date === robDayDate.toISOString().split("T")[0] && (
                      <Row 
                      fillWidth
                      padding="xs"
                      gap="m"
                      position="relative"
                      // height="xs"
                      mobileDirection="column"
                      overflow="hidden"
                      radius={undefined}
                      // key={`${activityInstance.id}`}
                      // bottomRadius="l"
                      // topRadius='l'
                      // alignItems="md:center"
                      // overflow="scroll"
                      // border="brand-medium"
                      // background="page"
                      // radius="l"
                    >
                      <Row fillWidth justifyContent="space-between">
                        <Row
                          border="brand-alpha-weak"
                          position="relative"
                          maxWidth={10}
                          // aspectRatio={0.75}
                          overflow="hidden"
                        >
                          <SmartImage
                            // fitWidth
                            src={urls[activityInstance.activityId] ?? "https://static-00.iconduck.com/assets.00/loading-icon-1024x1024-z5lrc2lo.png"}
                            alt="Robday"
                            aspectRatio="16/9"
                            objectFit="cover"
                            sizes="xs"
                            radius="xl"
                            // maxHeight={15}
                          />
                        </Row>
                        <Column>
                        {activityInstance.status === "Planned" || activityInstance.status === null && (
                          <Row justifyContent="flex-end" fillHeight alignItems="center">
                            <IconButton
                              icon="play"
                              onClick={() => startActivity(activityInstance)}
                              variant="tertiary"
                              size="s"
                            />
                          </Row>
                        )}
                        {activityInstance.status === "InProgress" && (
                          <Row justifyContent="flex-end" fillHeight alignItems="center" >
                            <IconButton
                              icon="stop"
                              onClick={() => stopActivity(activityInstance)}
                              variant="tertiary"
                              size="s"
                            />
                          </Row>
                        )}
                        {activityInstance.status === "Paused" && (
                          <Row justifyContent="flex-end" fillHeight alignItems="center">
                            <IconButton
                              icon="rewind"
                              onClick={() => resetActivityTime(activityInstance)}
                              variant="tertiary"
                              size="l"
                            />
                          </Row>
                        )}
                        </Column>
                      </Row>
                      <Column fillWidth fillHeight>
                        <Text
                          padding="xs" align="left" onBackground="neutral-strong" variant="display-default-xs"
                        >
                          {activityInstance.displayName?.toUpperCase() ?? "ACTIVITY TBD"}
                        </Text>
                        <Text
                          paddingLeft="xs" align="left" onBackground="neutral-medium" variant="code-default-xs"
                        >
                          {/* {activityInstance.location?.name?.toUpperCase() ?? "LOCATION TBD"} */}
                          {locations.find((location) => location.id === activityInstance.locationId)?.name?.toUpperCase() ?? "LOCATION TBD"}
                        </Text>
                        <Line/>
                          {activityInstance.notes?.map((note) => (
                            <Text key={note} padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s">
                              {note}
                            </Text>
                          ))}
                      </Column>
                      <Column justifyContent="space-evenly" mobileDirection="row" background="neutral-alpha-weak" border="neutral-alpha-medium" radius="s">
                        <IconButton
                          icon="close"
                          onClick={() => onRemoveActivityInstance(activityInstance)}
                          variant="tertiary"
                          size="s"
                        />
                        <IconButton
                          icon="edit"
                          onClick={() => onEditActivityInstance(activityInstance)}
                          variant="tertiary"
                          size="s"
                        />
                        <IconButton
                          icon="check"
                          onClick={() => onCompleteActivityInstance(activityInstance)}
                          variant="tertiary"
                          size="s"
                        />
                      </Column>
                      {/* </Background> */}
                    </Row>
                    )}
                <Column>
                  {newImageUrls[activityInstance.id] && (
                    <Column width="xs" justifyContent="center" mobileDirection="column">
                      {newImageUrls[activityInstance.id].map((image, index) => (
                        <Row key={index} fillWidth justifyContent="center">
                          <SmartImage
                            src={image}
                            alt="Robday"
                            aspectRatio="16/9"
                            objectFit="contain"
                            sizes="xs"
                            radius="xl"
                          />
                        </Row>
                      ))}
                  </Column>
                  )}
                  </Column>
                  {activityInstance.status !== "Planned" && activityInstance.status !== null && (
                  <MediaUpload
                  emptyState={<Row paddingBottom="80">Drag and drop or click to browse</Row>}
                  onFileUpload={(file) => addPhotoToActivityInstance(activityInstance, file)}
                  />
                  )}
                  <Line height={0.1}/>
                    
                </Column>
                ))}
                {/* {selectedActivities.map((activity, index) => (
                  <Column key={`${activity.id}`}>
                    <Row 
                    fillWidth
                    padding="xs"
                    gap="m"
                    position="relative"
                    // height="xs"
                    mobileDirection="column"
                    overflow="hidden"
                    radius={undefined}
                    // key={`${activity.id}`}
                    // bottomRadius="l"
                    // topRadius='l'
                    // alignItems="md:center"
                    // overflow="scroll"
                    // border="brand-medium"
                    // background="page"
                    // radius="l"
                  >
                    <Flex
                      border="brand-alpha-weak"
                      position="relative"
                      maxWidth={10}
                      // aspectRatio={0.75}
                      overflow="hidden"
                    >
                      <SmartImage
                        // fitWidth
                        // src={urls[selectedActivities.indexOf(activity)]}
                        src={urls[activity.id]}
                        alt="Robday"
                        aspectRatio="16/9"
                        objectFit="cover"
                        sizes="xs"
                        radius="xl"
                        // maxHeight={15}
                      />
                      <Fade
                        fillWidth
                        position="absolute"
                        top="0"
                        to="bottom"
                        height={1}
                        zIndex={3}
                        pattern={{
                          display: true,
                          size: '2'
                        }}
                      />
                      <Fade
                        fillWidth
                        position="absolute"
                        to="top"
                        bottom="0"
                        height={1}
                        zIndex={3}
                        pattern={{
                          display: true,
                          size: '2'
                        }}
                      />
                      <Fade
                        // fillWidth
                        width={1}
                        fillHeight
                        position="absolute"
                        to="left"
                        // bottom="0"
                        right="0"
                        // height={12}
                        zIndex={3}
                        pattern={{
                          display: true,
                          size: '2'
                        }}
                      />
                      <Fade
                        // fillWidth
                        width={1}
                        fillHeight
                        position="absolute"
                        to="right"
                        // bottom="0"
                        left="0"
                        // height={12}
                        zIndex={3}
                        pattern={{
                          display: true,
                          size: '2'
                        }}
                      />
                    </Flex>
                    <Column fillWidth >
                      <Text
                        padding="xs" align="left" onBackground="neutral-strong" variant="display-default-xs"
                      >
                        {activity.name?.toUpperCase() ?? "ACTIVITY TBD"}
                      </Text>
                      <Text
                        paddingLeft="xs" align="left" onBackground="neutral-medium" variant="code-default-xs"
                      >
                        {activity.location?.toUpperCase() ?? "LOCATION TBD"}
                      </Text>
                      <Line/>
                      <Text
                        padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s"
                      >
                        {activity.description}
                      </Text>
                    </Column>
                    <Column justifyContent="space-evenly" mobileDirection="row" background="neutral-alpha-weak" border="neutral-alpha-medium" radius="s">
                      <IconButton
                        icon="close"
                        onClick={() => onRemoveActivity(activity)}
                        variant="tertiary"
                        size="s"
                        />
                        <IconButton
                          icon="edit"
                          // onClick={() => setIsSecondDialogOpen(true)}
                          onClick={() => onEditActivity(activity)}
                          variant="tertiary"
                          size="s"
                        />
                        <IconButton
                          icon="check"
                          onClick={() => onCompleteActivity(activity)}
                          variant="tertiary"
                          size="s"
                          />
                      </Column>
                  </Row>
                  <Line height={0.1}/>
                </Column>
                ))} */}
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
              {robDayLog?.status === "Upcoming" && (
                <Row fillWidth justifyContent="center">
                  <Button
                    onClick={() => startRobDay()}
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
              {robDayLog?.status === "Started" && (
                <Row fillWidth justifyContent="center">
                  <Button
                    onClick={() => completeRobDayLog()}
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
          </Row>
          {/* </Card> */}
        </Column>
      </Column>
      
      <Dialog
        isOpen={isFirstDialogOpen}
        onClose={() => setIsFirstDialogOpen(false)}
        title="Remove Robday Activity?"
        description=""
        onHeightChange={(height) => setFirstDialogHeight(height)}
        style={{marginBottom: "50%"}}
        justifyContent="center"
        footer={
          <>
            <Button variant="secondary" onClick={() => removeActivity()}>
              REMOVE
            </Button>
          </>
        }
          >
          <Text variant="body-default-s">
            Are you sure you want to remove this activity from the Robday agenda?
          </Text>  
        </Dialog>

        <Dialog
        isOpen={isSecondDialogOpen}
        onClose={() => setIsSecondDialogOpen(false)}
        title="Edit Robday Activity"
        description=""
        // onHeightChange={(height) => setFirstDialogHeight(height)}
        footer={
          <>
            <Button variant="secondary" onClick={() => editActivity()}>
              UPDATE
            </Button>
          </>
        }
          >
          <Text variant="body-default-s">
            Set/change the location or add notes
          </Text>
          <Select
            searchable
            id="location"
            label={selectedLocationValueLabel}
            minHeight={300}
            options={[
              ...locations.map((location) => ({
                value: location.id,
                label: location.name,
                description: location.address,
              })),
              { value: "create-new", label: "Create New", description: "Add a new location" },
            ]}
            onSelect={(value) => {
              if (value === "create-new") {
                // Handle the "create new" action here
                // console.log("Create new location");
                handleCreateNewLocation();
                // You can open a modal or navigate to a different page to create a new location
              } else {
                handleSelectLocation(locations.find((location) => location.id === value) ?? locations[0]);
              }
            }}
            value={selectedLocationValue}
          />
          <Textarea
            id="notes"
            label="Activity Notes"
            value={activityInstanceNotes}
            onChange={(value) => setActivityInstanceNotes(value.target.value)}
          />
        </Dialog>
      <Dialog
       isOpen={isCreateNewLocationDialogOpen}
        onClose={() => setIsCreateNewLocationDialogOpen(false)}
        title="Create New Location"
        description=""
        style={{marginBottom: "50%"}}
        // onHeightChange={(height) => setFirstDialogHeight(height)}
        footer={
          <>
            <Button variant="secondary" onClick={() => createNewLocation()}>
              CREATE
            </Button>
          </>
        }
          >
          <Input
            id="location"
            label="Location Name"
            value={newLocationName}
            onChange={(value) => setNewLocationName(value.target.value)}
          />
          <Input
            id="address"
            label="Location Address"
            value={newLocationAddress}
            onChange={(value) => setNewLocationAddress(value.target.value)}
          />
        </Dialog>

      <Dialog
        isOpen={isCompleteDialogOpen}
        onClose={() => setIsCompleteDialogOpen(false)}
        title="Mark Robday Activity as Complete?"
        description=""
        style={{marginBottom: "50%"}}
        // onHeightChange={(height) => setFirstDialogHeight(height)}
        footer={
          <>
            <Button variant="secondary" onClick={() => completeActivity()}>
              COMPLETE
            </Button>
          </>
        }
          >
          <Text variant="body-default-s">
            Are you sure you want to mark this activity as complete?
          </Text>
      </Dialog>
      <Dialog
        isOpen={isAddActivityDialogOpen}
        onClose={() => setIsAddActivityDialogOpen(false)}
        title="Add Robday Activity"
        description=""
        style={{marginBottom: "50%"}}
        // onHeightChange={(height) => setFirstDialogHeight(height)}
        footer={
          <>
            <Button variant="secondary" onClick={() => addActivity()}>
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
            options={activities.map((activity) => {
              return { value: activity.id, label: activity.name, description: activity.description }
            })}
            // onChange={(value) => setSelectedValue(activities.find((activity) => activity.id === value.target.value)?.id ?? "")}
            // onChange={(value) => handleSelect(activities.find((activity) => activity.name === value.target.value ) ?? activities[0])}
            // onSelect={(value) => printSelect(value)}
            onSelect={(value) => handleSelect(activities.find((activity) => activity.id === value ) ?? activities[0])}
            value={selectedValue}
            // value=""
          />
        </Column>
      </Dialog>
      
        
    </Column>
  );
}