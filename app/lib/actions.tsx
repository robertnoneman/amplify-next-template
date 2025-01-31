'use server';


import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { getUrl } from 'aws-amplify/storage';
import { uploadData } from 'aws-amplify/storage';
import { RobDayLogActivityProps, TodoProps, LocationData, RobdayLogProps } from "@/app/lib/definitions";
import { getWeather, convertToPastTense2 } from "@/app/lib/utils";


Amplify.configure(outputs);

const client = generateClient<Schema>();

export async function getImageUrl(key: string) {
  const url = getUrl({
  path: key
  });
  return (await url).url.toString();
}

export async function updateTodo(id: string, props: TodoProps) {
  console.log("Updating todo", props);
  const fullResult = await client.models.Todo.update({
    id: id,
    content: props.content,
    isDone: !props.isDone,
    status: props.status,
  });
  console.log("Update result", fullResult);
  revalidatePath("/dashboard/todos");
}

export async function createTodo(content: string) {
  console.log("Creating todo", content);
  const fullResult = await client.models.Todo.create({
    content: content,
    isDone: false,
  });
  console.log("Create result", fullResult);
  revalidatePath("/dashboard/todos");
}

export async function fetchTodos() {
  const todos = await client.models.Todo.list();
  const todoProps = todos.data.map(todo => ({
    id: todo.id,
    content: todo.content ?? "",
    isDone: todo.isDone ?? false,
    status: todo.status ?? "Todo",
  }));
  return todoProps;
}

export async function fetchRobdayLogs() {
  const robDayLogs = await client.models.Robdaylog.list();
  const robDayLogProps = robDayLogs.data.map(robDayLog => ({
    robdayLogId: robDayLog.id,
    status: robDayLog.status as "Upcoming" | "Started" | "Completed",
    robdayLogDate: robDayLog.date,
    robdayLogNumber: robDayLog.robDayNumber ?? 0,
    robdayLogWeather: robDayLog.weatherCondition ?? "",
    robdayLogTemperature: robDayLog.temperature ?? 0,
    rating: robDayLog.rating ?? 0,
    cost: robDayLog.cost ?? 0,
    duration: robDayLog.totalTime ?? 0,
    startTime: robDayLog.startTime ?? 0,
    endTime: robDayLog.endTime ?? 0,
    totalTime: robDayLog.totalTime ?? 0,
    notes: [],
    locationData: [],
    baseActivities: [],
    aiProps: [],
    urlsDict: {},
  }));
  return robDayLogProps;
}

export async function fetchRobdaylogForDate(date: string) {
  const robDayLogs = await client.models.Robdaylog.list();
  const robDayLogProps = robDayLogs.data.map(robDayLog => ({
    robdayLogId: robDayLog.id,
    date: robDayLog.date,
    baseActivities: robDayLog.activities,
  }));
  return robDayLogProps.find(robDayLog => robDayLog.date === date);
}

export async function createRobdayLog(id: string, date: string) {
  console.log("Creating Robday Log", date);
  const fullResult = await client.models.Robdaylog.create({
    date: date ?? new Date().toISOString().split("T")[0],
    // activities: [],
  });
  console.log("Create result", fullResult);
  revalidatePath("/dashboard/planner");
}

export async function updateRobdayLog(id: string, props: RobdayLogProps) {
  console.log("Updating Robday Log", props);
  const fullResult = await client.models.Robdaylog.update({
    id: id,
    status: props.status,
    robDayNumber: props.robdayLogNumber,
    weatherCondition: props.robdayLogWeather,
    notes: props.notes,
    temperature: props.robdayLogTemperature,
    rating: props.rating,
    cost: props.cost,
    startTime: props.startTime,
    endTime: props.endTime,
    totalTime: props.duration,
  });
  console.log("Update result", fullResult);
  revalidatePath("/dashboard/planner");
}

export async function completeRobDayLog(id: string) {
  console.log("Completing Robday Log", id);
  const fullResult = await client.models.Robdaylog.update({
    id: id,
    status: "Completed",
  });
  console.log("Update result", fullResult);
  revalidatePath("/dashboard/planner");
}

export async function fetchActivities() {
  const activities = await client.models.Activity.list();
  const activityProps = activities.data.map(activity => ({
    id: activity.id,
    name: activity.name,
    count: activity.count,
    rating: activity.rating,
    cost: activity.cost,
    level_of_effort: activity.lever_of_effort,
    location: activity.location,
    categories: activity.categories,
  }));
  return activityProps;
}

export async function populateBaseActivityProps() {
  const activities = await client.models.Activity.list();
  const activityProps = activities.data.map(activity => ({
    activityId: activity.id ?? "",
    activityName: activity.name ?? "",
    activityDescription: activity.description ?? "",
    activityCategories: [],
    activityImageUrl: activity.image ?? "",
  }));
  return activityProps;
}

export async function fetchLocations() {
  const locations = await client.models.Location.list();
  const locationProps = locations.data.map(location => ({
    id: location.id ?? "",
    name: location.name ?? "",
    address: location.address ?? "",
  }));
  return locationProps;
}

export async function createLocation(id: string, props: LocationData) {
  console.log("Creating location", props);
  const fullResult = await client.models.Location.create({
    name: props.name,
    address: props.address,
  });
  console.log("Create result", fullResult);
  // revalidatePath("/dashboard/locations");
}

export async function fetchActivityInstances() {
  const activityInstances = await client.models.ActivityInstance.list();
  const activityInstanceProps = activityInstances.data.map(activityInstance => ({
    id: activityInstance.id,
    displayName: activityInstance.displayName,
    images: activityInstance.images,
    notes: activityInstance.notes,
    rating: activityInstance.rating,
    cost: activityInstance.cost,
    locationId: activityInstance.locationId,
  }));
  return activityInstanceProps;
}

export async function removeActivity(id: string) {
  console.log("Removing activity", id);
  const fullResult = await client.models.Activity.update({ id: id, isOnNextRobDay: false });
  console.log("Remove activity", fullResult);
  revalidatePath("/dashboard/activities");
}

export async function removeActivityInstance(id: string) {
  console.log("Removing activity instance", id);
  const fullResult = await client.models.ActivityInstance.delete({ id });
  console.log("Delete result", fullResult);
  revalidatePath("/dashboard/gallery");
}

export async function createActivityInstance(robdayLogId: string, activityId: string) {
  const activity = await client.models.Activity.get({ id: activityId });
  const robdayLog = await client.models.Robdaylog.get({ id: robdayLogId });
  const date = robdayLog.data?.date ?? new Date().toISOString().split("T")[0];
  const fullResult = await client.models.ActivityInstance.create({
    date: date,
    status: "Planned",
    displayName: activity.data?.name,
    activityId: activityId,
    robdaylogId: robdayLogId,
    completed: false,
  });
  console.log("Create result", fullResult);
  revalidatePath("/dashboard/planner");
}

export async function updateActivityInstance(id: string, activity: RobDayLogActivityProps) {
  // const locationData = await client.models.Location.list();
  console.log("Updating activity instance", activity);
  const fullResult = await client.models.ActivityInstance.update({
    id: id,
    displayName: activity.activityInstanceDisplayName,
    images: activity.images,
    notes: activity.activityInstanceNotes,
    rating: activity.activityInstanceRating,
    cost: activity.activityInstanceCost,
    locationId: activity.locationData.id,
  });
  console.log("Update result", fullResult);
  revalidatePath("/dashboard/gallery");
}

export async function startActivityInstance(activity: RobDayLogActivityProps) {
  console.log("Starting activity instance", activity);
  const startTime = new Date().getTime();
  const current = await getWeather(38.9143, -77.0102);
  const temp = Number(current.temperature?.split(" F")[0]);
  const conditions = current.conditions
  const fullResult = await client.models.ActivityInstance.update({
    id: activity.activityInstanceId,
    status: "InProgress",
    startTime: startTime,
    temperature: temp,
    weatherCondition: conditions,
  });
  console.log("Update result", fullResult);
  revalidatePath("/dashboard/planner");
}

export async function pauseActivityInstance(activity: RobDayLogActivityProps) {
  console.log("Pausing activity instance", activity);
  const endTime = new Date().getTime();
  const fullResult = await client.models.ActivityInstance.update({
    id: activity.activityInstanceId,
    status: "Paused",
    endTime: endTime,
  });
  console.log("Update result", fullResult);
  revalidatePath("/dashboard/planner");
}

export async function completeActivityInstance(id: string, activity: RobDayLogActivityProps) {
  console.log("Completing activity instance", activity);
  const activityInstance = await client.models.ActivityInstance.get({ id: activity.activityInstanceId });
  const activityId = activityInstance.data?.activityId;
  if (!activityId) {
    throw new Error("Activity ID is undefined");
  }
  const activityResult = await client.models.Activity.update({ id: activityId, isOnNextRobDay: false });
  console.log("Activity update result", activityResult);
  const newDisplayName = convertToPastTense2(activity.activityInstanceDisplayName.toLocaleLowerCase());
  const endTime = new Date().getTime();
  const totalTime = endTime - (activityInstance?.data?.startTime ?? 0);
  const fullResult = await client.models.ActivityInstance.update({
    id: activity.activityInstanceId,
    status: "Completed",
    endTime: endTime,
    totalTime: totalTime,
    displayName: newDisplayName,
    completed: true,
  });
  console.log("Activity Instance Update result", fullResult);
  revalidatePath("/dashboard/planner");
}

export async function resetActivityInstance(id: string, activity: RobDayLogActivityProps) {
  console.log("Resetting activity instance", activity);
  const fullResult = await client.models.ActivityInstance.update({
    id: activity.activityInstanceId,
    status: "Planned",
    startTime: 0,
    endTime: 0,
    totalTime: 0,
  });
  console.log("Update result", fullResult);
  revalidatePath("/dashboard/planner");
}
