import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { start } from "repl";

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
      status: a.enum(["Todo", "InProgress", "Completed"]),
      notes: a.string().array(),
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

  // Relational tables
  RobdaylogActivity: a
    .model({
      robdaylogId: a.id().required(),
      activityId: a.id().required(),

      robdaylog: a.belongsTo("Robdaylog", "robdaylogId"),
      activity: a.belongsTo("Activity", "activityId"),
    }).authorization((allow) => [allow.publicApiKey()]),
  RobdaylogLocation: a
    .model({
      robdaylogId: a.id().required(),
      locationId: a.id().required(),

      robdaylog: a.belongsTo("Robdaylog", "robdaylogId"),
      location: a.belongsTo("Location", "locationId"),
    }).authorization((allow) => [allow.publicApiKey()]),
    ActivityLocation: a
      .model({
        activityId: a.id().required(),
        locationId: a.id().required(),
        location: a.belongsTo("Location", "locationId"),
        activity: a.belongsTo("Activity", "activityId"),
      }).authorization((allow) => [allow.publicApiKey()]),

  Robdaylog: a
    .model({
      date: a.date().required(),
      status: a.enum(["Upcoming", "Started", "Completed"]),
      robDayNumber: a.integer(),
      notes: a.string().array(),
      weatherCondition: a.string(),
      temperature: a.float(),
      rating: a.integer(),
      cost: a.float(),
      duration: a.time(),
      startTime: a.timestamp(),
      endTime: a.timestamp(),
      totalTime: a.float(),
      locations: a.hasMany("RobdaylogLocation", "robdaylogId"),
      activities: a.hasMany("RobdaylogActivity", "robdaylogId"),
      activityInstances: a.hasMany("ActivityInstance", "robdaylogId")
    }).authorization((allow) => [allow.publicApiKey()]),

  Activity: a
    .model({
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
      duration: a.float(),
      locations: a.hasMany("ActivityLocation", "activityId"),
      robdaylogs: a.hasMany("RobdaylogActivity", "activityId"),
      activityInstances: a.hasMany("ActivityInstance", "activityId")
    }).authorization((allow) => [allow.publicApiKey()]),
  ActivityInstance: a
    .model({
      date: a.date().required(),
      status: a.enum(["Planned", "InProgress", "Paused", "Completed"]),
      displayName: a.string(),
      startTime: a.timestamp(),
      endTime: a.timestamp(),
      totalTime: a.float(),
      notes: a.string().array(),
      weatherCondition: a.string(),
      temperature: a.float(),
      rating: a.integer(),
      loe: a.integer(),
      cost: a.float(),
      images: a.string().array(),
      activityId: a.id().required(),
      locationId: a.id(),
      robdaylogId: a.id(),
      activity: a.belongsTo("Activity", "activityId"),
      location: a.belongsTo("Location", "locationId"),
      robdayLog: a.belongsTo("Robdaylog", "robdaylogId"),
      completed: a.boolean(),
      isOnNextRobDay: a.boolean(),
    }).authorization((allow) => [allow.publicApiKey()]),
  Location: a
    .model({
      name: a.string(),
      description: a.string(),
      address: a.string(),
      latitude: a.float(),
      longitude: a.float(),
      activities: a.hasMany("ActivityLocation", "locationId"),
      robdaylogs: a.hasMany("RobdaylogLocation", "locationId"),
      activityInstances: a.hasMany("ActivityInstance", "locationId")
    }).authorization((allow) => [allow.publicApiKey()]),
  DartGame: a
    .model({
      startTime: a.timestamp(),
      endTime: a.timestamp(),
      status: a.enum(["InProgress", "Completed"]),
      gameType: a.enum(["Cricket", "ThreeOhOne", "FiveOhOne", "SevenOhOne", "Baseball", "RobdayNightFootball"]),
      player1Name: a.string(),
      player2Name: a.string(),
      x01RoundScoresPlayer1: a.integer().array(),
      x01RoundScoresPlayer2: a.integer().array(),
      baseballInningScoresPlayer1: a.integer().array(),
      baseballInningScoresPlayer2: a.integer().array(),
      baseballInningErrorsPlayer1: a.integer().array(),
      baseballInningErrorsPlayer2: a.integer().array(),
      cricketTotalPointsPlayer1: a.integer().array(),
      cricketTotalPointsPlayer2: a.integer().array(),
      cricketMarksPlayer1: a.integer().array(),
      cricketMarksPlayer2: a.integer().array(),
      robdayNightFootballScoresPlayer1: a.integer().array(),
      robdayNightFootballScoresPlayer2: a.integer().array(),
      winnerName: a.string(),
      loserName: a.string(),
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
