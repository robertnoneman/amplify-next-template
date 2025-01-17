import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      isDone: a.boolean(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  Category: a.customType({
    category: a.enum(["Game", "Food", "Craft", "Music", "Movie", "Exercise", "Outdoor", "Indoor", "Other"])
  }),

  PostTag: a.model({
    // 1. Create reference fields to both ends of
    //    the many-to-many relationship
    postId: a.id().required(),
    tagId: a.id().required(),
    // 2. Create relationship fields to both ends of
    //    the many-to-many relationship using their
    //    respective reference fields
    post: a.belongsTo('Post', 'postId'),
    tag: a.belongsTo('Tag', 'tagId'),
  }).authorization((allow) => [allow.publicApiKey()]),
  
  Post: a.model({
    title: a.string(),
    content: a.string(),
    // 3. Add relationship field to the join model
    //    with the reference of `postId`
    tags: a.hasMany('PostTag', 'postId'),
  }).authorization((allow) => [allow.publicApiKey()]),

  Tag: a.model({
    name: a.string(),
    // 4. Add relationship field to the join model
    //    with the reference of `tagId`
    posts: a.hasMany('PostTag', 'tagId'),
  }).authorization((allow) => [allow.publicApiKey()]),

  RobdaylogActivity: a
    .model({
      robdaylogId: a.id().required(),
      activityId: a.id().required(),

      robdaylog: a.belongsTo("Robdaylog", "robdaylogId"),
      activity: a.belongsTo("Activity", "activityId"),
    }).authorization((allow) => [allow.publicApiKey()]),
  Robdaylog: a
    .model({
      // robDayLogId: a.id(),
      // activityId: a.id(),

      date: a.date().required(),
      robDayNumber: a.integer(),
      notes: a.string().array(),
      weatherCondition: a.string(),
      temperature: a.float(),
      rating: a.integer(),
      cost: a.float(),
      duration: a.time(),

      activities: a.hasMany("RobdaylogActivity", "robdaylogId"),
    }).authorization((allow) => [allow.publicApiKey()]),
  Activity: a
    .model({
      // activityId: a.id(),
      // robDayLogId: a.id(),
      name: a.string(),
      description: a.string(),
      count: a.integer(),
      rating: a.float(),
      notes: a.string().array(),
      image: a.string(),
      lever_of_effort: a.integer(),
      categories: a.string().array(),
      cost: a.integer(),
      costMax: a.integer(),
      location: a.string(),
      isOnNextRobDay: a.boolean(),
      // robDayLog: a.belongsTo("RobDayLog", "robDayLogId"),

      robdaylogs: a.hasMany("RobdaylogActivity", "activityId")
    }).authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
