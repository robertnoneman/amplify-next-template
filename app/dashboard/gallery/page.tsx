// "use client";

import {
  Column,
  Row,
  Heading,
  Background,
  Dialog,
  Button,
  Flex,
  Input,
  Textarea,
  Switch,
  TagInput,
  Select,
  Skeleton
} from "@/once-ui/components";

import RobdayLog from "@/app/ui/dashboard/robday-log";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { data, type Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json"
import { act, useEffect, useState } from "react";
import { getUrl } from 'aws-amplify/storage';
import { uploadData } from 'aws-amplify/storage';
import { MediaUpload } from "@/once-ui/modules";
import RobdaylogWrapper from "@/app/ui/dashboard/robdaylog-wrapper";
import { Suspense } from "react";

// Amplify.configure(outputs);

// const client = generateClient<Schema>();

// interface RobdayLogProps {
//   robdayLogNumber: string;
//   robdayLogDate: string;
//   robdayLogWeather: string;
//   robdayLogTemperature: number;
//   robdayLogActivities: Schema["RobdaylogActivity"]["type"][];
//   activitiesDict: Record<string, Schema["Activity"]["type"]>;
//   activityInstances: Schema["ActivityInstance"]["type"][];
//   urlsDict: Record<string, string>;
//   notes: Array<string>;
//   locations: Schema["Location"]["type"][];
// }


export default async function Page() {
  // const [robdayLogs, setRobdayLogs] = useState<Array<Schema["Robdaylog"]["type"]>>([]);
  // const [robdayLogProps, setRobdayLogProps] = useState<Array<RobdayLogProps>>([]);
  // const [sortRecent, setSortRecent] = useState<boolean>(false);
  // const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  // const [robdayLogActivities, setRobdayLogActivities] = useState<Schema["RobdaylogActivity"]["type"][]>([]);
  // const [activitiesDict, setActivitiesDict] = useState<Record<string, Schema["Activity"]["type"]>>({});
  // const [editedActivity, setEditedActivity] = useState<Schema["ActivityInstance"]["type"] | null>(null);

  // const [activityDisplayName, setActivityDisplayName] = useState<string>("");
  // const [activityLocationId, setActivityLocationId] = useState<string>("");
  // const [activityNotes, setActivityNotes] = useState<string[]>([]);
  // const [activityImages, setActivityImages] = useState<string[]>([]);
  // const [activityCost, setActivityCost] = useState<number>(0);
  // const [activityRating, setActivityRating] = useState<number>(0);

  // const [locations, setLocations] = useState<Array<Schema["Location"]["type"]>>([]);
  // const [selectedLocationValue, setSelectedLocationValue] = useState("");
  // const [selectedLocationValueLabel, setSelectedLocationValueLabel] = useState("Choose a location");
  // const [selectedLocation, setSelectedLocation] = useState<Schema["Location"]["type"]>();



  // useEffect(() => {
  //   const getImageUrl = async (key: string): Promise<string> => {
  //     const url = getUrl({
  //         path: key
  //     });
  //       return (await url).url.toString();
  //   }

  //   function listLocations() {
  //     client.models.Location.observeQuery().subscribe({
  //       next: async (data) => {
  //         setLocations([...data.items]);
  //       },
  //     })
  //   }

  //   async function fetchRobdayLogs() {
  //     client.models.Robdaylog.observeQuery().subscribe({
  //       next: async (data) => {
  //         setRobdayLogs([...data.items]);
  //         const robdayLogProps: Array<RobdayLogProps> = [];
  //         await Promise.all(data.items.map(async (robdayLog) => {
  //           const robdayLogActivities = await robdayLog.activities();
  //           const robdayLogActivityInstances = await robdayLog.activityInstances();
  //           // const robdayLogActivityInstances = robdayLog.activityInstances;
  //           // console.log("LOGGING ACTIVITY INSTANCES");
  //           // console.log("ACTIVITY INSTANCES: ", robdayLogActivityInstances.data);
  //           // console.log("DONE LOGGING ACTIVITY INSTANCES");
  //           const activitiesDict: Record<string, Schema["Activity"]["type"]> = {};
  //           const urlsDict: Record<string, string> = {};
  //           await Promise.all(robdayLogActivities.data.map(async (robdayLogActivity) => {
  //             const activity = await robdayLogActivity.activity();
  //             if (activity.data) {
  //               activitiesDict[robdayLogActivity.id] = activity.data;
  //               if (activity.data.image) {
  //                 const url = await getImageUrl(activity.data.image);
  //                 if (url) {
  //                   urlsDict[robdayLogActivity.id] = url;
  //                 }
  //               }
  //             }
  //           }));
  //           // console.log("ROBDAYLOG ACTIVITIES: ", robdayLogActivities.data);
  //           robdayLogProps.push({
  //             robdayLogNumber: robdayLog.robDayNumber?.toString() || "",
  //             robdayLogDate: robdayLog.date,
  //             robdayLogWeather: robdayLog.weatherCondition?.toString() || "",
  //             robdayLogTemperature: robdayLog.temperature?.valueOf() || 0,
  //             robdayLogActivities: robdayLogActivities.data,
  //             activitiesDict: activitiesDict,
  //             activityInstances: robdayLogActivityInstances.data,
  //             urlsDict: urlsDict,
  //             notes: Array.isArray(robdayLog.notes) ? robdayLog.notes.filter(note => note !== null) : [],
  //             locations: locations
  //           });
  //         }));
  //         robdayLogProps.sort((b, a) => Number(a.robdayLogNumber) - Number(b.robdayLogNumber));
  //         setRobdayLogProps(robdayLogProps);    
  //       }
  //     });
  //   }
  //   listLocations();
  //   fetchRobdayLogs();
  // }, []);

  return (
    <Column fillWidth paddingY="80" paddingX="s" alignItems="center" flex={1}>
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
              x: 0,
              y: 0,
              radius: 200,
            }}
            position="absolute"
            gradient={{
              display: true,
              tilt: 0,
              opacity: 50,
              height: 30,
              width: 275,
              x: 100,
              y: 40,
              colorStart: "accent-solid-strong",
              colorEnd: "static-transparent",
            }}
          />
          <Background
            mask={{
              x: 100,
              y: 0,
              radius: 50,
              cursor: true
            }}
            position="absolute"
            gradient={{
              display: true,
              opacity: 80,
              tilt: -90,
              height: 220,
              width: 120,
              x: 120,
              y: 35,
              colorStart: "brand-solid-strong",
              colorEnd: "static-transparent",
            }}
          />
          <Heading wrap="balance" variant="display-default-l" align="center" marginBottom="16">
            ROBDAY MEMORIES
          </Heading>
        </Column>
        <Column fillWidth alignItems="center" gap="32" position="relative">
          <Suspense fallback={<Skeleton shape="block" width="xl" height="m" />}>
            <RobdaylogWrapper />
          </Suspense>
        </Column>
        {/* { robdayLogProps.map((robdayLogProp, index) => (
            <RobdayLog 
              key={robdayLogProp.robdayLogNumber} 
              robdayLogNumber={robdayLogProp.robdayLogNumber} 
              robdayLogDate={robdayLogProp.robdayLogDate} 
              robdayLogWeather={robdayLogProp.robdayLogWeather}
              robdayLogTemperature={robdayLogProp.robdayLogTemperature}
              robdayLogActivities={robdayLogProp.robdayLogActivities} 
              activitiesDict={robdayLogProp.activitiesDict}
              activityInstances={robdayLogProp.activityInstances}
              urlsDict={robdayLogProp.urlsDict}
              notes={robdayLogProp.notes}
              locations={locations}
              />
          ))} */}
      </Column>
    </Column>
  )
}