import RobdayLog from '@/app/ui/dashboard/robday-log';

import {
    Column,
    Heading,
    Row,
    Grid,
    Text
  } from "@/once-ui/components";

import outputs from "@/amplify_outputs.json"
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { data, type Schema } from "@/amplify/data/resource";
import { getUrl } from 'aws-amplify/storage';

Amplify.configure(outputs);

const client = generateClient<Schema>();

interface RobdayLogProps {
    robdayLogNumber: string;
    robdayLogDate: string;
    robdayLogId: string;
    robdayLogWeather: string;
    robdayLogTemperature: number;
    robdayLogActivities: Schema["RobdaylogActivity"]["type"][];
    // activitiesDict: Record<string, Schema["Activity"]["type"]>;
    activityInstances: Schema["ActivityInstance"]["type"][];
    aiProps: RobDayLogActivityProps[];
    urlsDict: Record<string, string>;
    notes: Array<string>;
    // locations: Schema["Location"]["type"][];
    locationData: LocationData[];
  }

  interface RobDayLogActivityProps {
    // activityInstance: Schema["ActivityInstance"]["type"];
    activityInstanceId: string;
    activityInstanceDisplayName: string;
    activityInstanceNotes: string[];
    activityInstanceRating: number;
    activityInstanceCost: number;
    images: string[];
    location: string;
    imageUrls: Array<string>;
    // populateActivityInstance: (activityInstance: Schema["ActivityInstance"]["type"]) => void;
  }

  interface LocationData {
    id: string;
    name: string;
    address: string;
  }

export default async function RobdaylogWrapper() {
    
    // const activities = await client.models.Activity.list();
    // const activityInstances = await client.models.ActivityInstance.list();
    const locations = await client.models.Location.list();
    const robdayLogs = (await client.models.Robdaylog.list()).data.sort((a, b) => Number(b.robDayNumber) - Number(a.robDayNumber));
    const robdayLogProps = await populateRobdayLogProps(robdayLogs);
    // console.log("Activities fetched: ", activities);
    // console.log("Activity Instances fetched: ", activityInstances);
    // console.log("Locations fetched: ", locations);
    // console.log("Robday Logs fetched: ", robdayLogs);

    

    async function populateRobdayLogProps(robdayLogs: Schema["Robdaylog"]["type"][]) {
        const getImageUrl = async (key: string): Promise<string> => {
            const url = getUrl({
                path: key
            });
              return (await url).url.toString();
        }
        const robdayLogProps: RobdayLogProps[] = [];
        const locationData: LocationData[] = [];
        for (const location of locations.data) {
            locationData.push({
                id: location.id,
                name: location.name ?? "",
                address: location.address ?? ""
            });
        }
        for (const robdayLog of robdayLogs) {
            // const robdayLogActivities = (await client.models.RobdaylogActivity.list({ robdaylogID: robdayLog.id })).data;
            const robdayLogActivities = await robdayLog.activities();
            const robdayLogActivityInstances = await robdayLog.activityInstances();
            const robdayLogActivityInstanceProps: RobDayLogActivityProps[] = [];
            robdayLogActivityInstances.data.forEach(async (activityInstance) => {
                const location = await activityInstance.location();
                const imageUrls: Array<string> = [];
                const baseActivity = await client.models.Activity.get({ id: activityInstance.activityId });
                const baseActivityImages = baseActivity.data?.image;
                const url2 = await getImageUrl(baseActivityImages ?? "picture-submissions/placeholderImage.jpg");
                imageUrls.push(url2);
                if (activityInstance.images) {
                    await Promise.all(activityInstance.images.map(async (key, index) => {
                        if (key) {
                        const url = await getImageUrl(key);
                        if (url) {
                            imageUrls[index] = url;
                        }
                        }
                    }));
                }
                robdayLogActivityInstanceProps.push({
                    // activityInstance: activityInstance,
                    activityInstanceId: activityInstance.id,
                    activityInstanceDisplayName: activityInstance.displayName ?? "",
                    activityInstanceNotes: (activityInstance.notes ?? []).filter((note): note is string => note !== null),
                    activityInstanceRating: activityInstance.rating ?? 0,
                    activityInstanceCost: activityInstance.cost ?? 0,
                    images: (activityInstance.images ?? []).filter((image): image is string => image !== null),
                    location: location?.data?.name || "",
                    imageUrls: imageUrls
                });
            });
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
            // const notes = robdayLogActivities.map(robdayLogActivity => robdayLogActivity.notes ?? "");
            robdayLogProps.push({
                robdayLogNumber: robdayLog.robDayNumber?.toString() || "",
                robdayLogDate: robdayLog.date,
                robdayLogId: robdayLog.id,
                robdayLogWeather: robdayLog.weatherCondition?.toString() || "",
                robdayLogTemperature: robdayLog.temperature?.valueOf() || 0,
                robdayLogActivities: robdayLogActivities.data,
                // activitiesDict: activitiesDict,
                activityInstances: robdayLogActivityInstances.data,
                aiProps: robdayLogActivityInstanceProps,
                urlsDict: urlsDict,
                notes: Array.isArray(robdayLog.notes) ? robdayLog.notes.filter(note => note !== null) : [],
                // locations: locations.data
                locationData: locationData
            });
        }
        return robdayLogProps;
    }

    return (
       <Column fillWidth alignItems="center" gap="32" padding="xs" position="relative">
            { robdayLogProps.map((robdayLogProp, index) => (
            <RobdayLog 
                key={robdayLogProp.robdayLogNumber} 
                robdayLogNumber={robdayLogProp.robdayLogNumber} 
                robdayLogDate={robdayLogProp.robdayLogDate}
                robdayLogId={robdayLogProp.robdayLogId}
                robdayLogWeather={robdayLogProp.robdayLogWeather}
                robdayLogTemperature={robdayLogProp.robdayLogTemperature}
                // robdayLogActivities={robdayLogProp.robdayLogActivities} 
                // activitiesDict={robdayLogProp.activitiesDict}
                // activityInstances={robdayLogProp.activityInstances}
                robdayLogActivityProps={robdayLogProp.aiProps}
                urlsDict={robdayLogProp.urlsDict}
                notes={robdayLogProp.notes}
                // locations={locations.data}
                locationData={robdayLogProp.locationData}
                />
            ))}
        </Column>
    )
}