'use server';


import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { getUrl } from 'aws-amplify/storage';
import { uploadData } from 'aws-amplify/storage';
import { RobDayLogActivityProps, TodoProps } from "@/app/lib/definitions";


Amplify.configure(outputs);

const client = generateClient<Schema>();

export async function getImageUrl(key: string) {
  const url = getUrl({
  path: key
  });
  return (await url).url.toString();
}

export async function updateActivityInstance(activity: RobDayLogActivityProps) {
  console.log("Updating activity instance", activity);
  const fullResult = await client.models.ActivityInstance.update({
    id: activity.activityInstanceId,
    displayName: activity.activityInstanceDisplayName,
    images: activity.images,
    notes: activity.activityInstanceNotes,
    rating: activity.activityInstanceRating,
    cost: activity.activityInstanceCost,
    locationId: activity.locationId,
  });
  console.log("Update result", fullResult);
  revalidatePath("/dashboard/gallery");
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