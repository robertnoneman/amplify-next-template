"use client";

import {
    Column,
    Heading,
    Background
  } from "@/once-ui/components";

import RobdayLog from "@/app/ui/dashboard/robday-log";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { data, type Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json"
import { act, useEffect, useState } from "react";
import { getUrl } from 'aws-amplify/storage';

Amplify.configure(outputs);

const client = generateClient<Schema>();

interface RobdayLogProps {
  robdayLogNumber: string;
  robdayLogDate: string;
  robdayLogWeather: string;
  robdayLogTemperature: number;
  robdayLogActivities: Schema["RobdaylogActivity"]["type"][];
  activitiesDict: Record<string, Schema["Activity"]["type"]>;
  urlsDict: Record<string, string>;
}


export default function Page() {
  const [robdayLogs, setRobdayLogs] = useState<Array<Schema["Robdaylog"]["type"]>>([]);
  const [robdayLogProps, setRobdayLogProps] = useState<Array<RobdayLogProps>>([]);
  const [robdayLogActivities, setRobdayLogActivities] = useState<Schema["RobdaylogActivity"]["type"][]>([]);
  const [activitiesDict, setActivitiesDict] = useState<Record<string, Schema["Activity"]["type"]>>({});

  const getImageUrl = async (key: string): Promise<string> => {
        const url = getUrl({
            path: key
        });
          return (await url).url.toString();
    }

  async function fetchRobdayLogs() {
    client.models.Robdaylog.observeQuery().subscribe({
      next: async (data) => {
        const robdayLogProps: Array<RobdayLogProps> = [];
        await Promise.all(data.items.map(async (robdayLog) => {
          const robdayLogActivities = await robdayLog.activities();
          const activitiesDict: Record<string, Schema["Activity"]["type"]> = {};
          const urlsDict: Record<string, string> = {};
          await Promise.all(robdayLogActivities.data.map(async (robdayLogActivity) => {
            const activity = await robdayLogActivity.activity();
            if (activity.data) {
              activitiesDict[robdayLogActivity.id] = activity.data;
              if (activity.data.image) {
                const url = await getImageUrl(activity.data.image);
                if (url) {
                  urlsDict[robdayLogActivity.id] = url;
                }
              }
            }
          }));
          console.log(robdayLogActivities.data);
          robdayLogProps.push({
            robdayLogNumber: robdayLog.robDayNumber?.toString() || "",
            robdayLogDate: robdayLog.date,
            robdayLogWeather: robdayLog.weatherCondition?.toString() || "",
            robdayLogTemperature: robdayLog.temperature?.valueOf() || 0,
            robdayLogActivities: robdayLogActivities.data,
            activitiesDict: activitiesDict,
            urlsDict: urlsDict
          });
        }));
        setRobdayLogs([...data.items]);
        setRobdayLogProps(robdayLogProps);    
      }
    });
  }
  

  useEffect(() => {
    fetchRobdayLogs();
  }, []);

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
              x: 80,
              y: 0,
              radius: 200,
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
              x: 100,
              y: 0,
              radius: 200,
            }}
            position="absolute"
            gradient={{
              display: true,
              opacity: 100,
              tilt: -35,
              height: 20,
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
        </Column>
        <Column fillWidth alignItems="center" gap="32" padding="xs" position="relative">
          HERE'S WHERE ALL THE PRETTY PICTURES WILL BE!
          {/* <RobdayLog /> */}
          {/* {robdayLogs.map((robdayLog, index) => (
            <RobdayLog key={index} robdayLogId={robdayLog.id} />
          ))} */}
          { robdayLogProps.map((robdayLogProp, index) => (
            <RobdayLog 
              key={index} 
              robdayLogNumber={robdayLogProp.robdayLogNumber} 
              robdayLogDate={robdayLogProp.robdayLogDate} 
              robdayLogWeather={robdayLogProp.robdayLogWeather}
              robdayLogTemperature={robdayLogProp.robdayLogTemperature}
              robdayLogActivities={robdayLogProp.robdayLogActivities} 
              activitiesDict={robdayLogProp.activitiesDict}
              urlsDict={robdayLogProp.urlsDict}
              />
          ))}
        </Column>
      </Column>
    )
  }