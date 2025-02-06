import outputs from "@/amplify_outputs.json"
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { data, type Schema } from "@/amplify/data/resource";
import { getUrl } from 'aws-amplify/storage';
import {
  RobDayLogActivityProps,
  LocationData,
  RobDayLogBaseActivityProps,
  RobdayLogProps,
} from "@/app/lib/definitions";
import { populateBaseActivityProps, fetchLocations } from "@/app/lib/actions";
import Agenda from "@/app/ui/dashboard/planner/agenda";

Amplify.configure(outputs);

const client = generateClient<Schema>();


export default async function AgendaWrapper() {
  const locations = await client.models.Location.list();
  const robdayLogProps = await populateRobdayLogProps((await client.models.Robdaylog.list()).data.sort((b, a) => Number(b.robDayNumber) - Number(a.robDayNumber)));
  const baseActivityProps = await populateBaseActivityProps();
  const locationData = await fetchLocations();

  async function populateRobdayLogProps(robdayLogs: Schema["Robdaylog"]["type"][]) {
    const getImageUrl = async (key: string): Promise<string> => {
      const url = `https://amplify-d2e7zdl8lpqran-ma-robdayimagesbuckete97c22-bwldlxhxdd4t.s3.us-east-1.amazonaws.com/${key}`;
      return url;
      // const url = getUrl({
      //   path: key
      // });
      // return (await url).url.toString();
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
      const robdayLogBaseActivityProps: RobDayLogBaseActivityProps[] = [];
      robdayLogActivities.data.forEach(async (robdayLogActivity) => {
        const activity = await robdayLogActivity.activity();
        if (activity.data) {
          robdayLogBaseActivityProps.push({
            activityId: activity.data.id,
            activityName: activity.data.name ?? "",
            activityDescription: activity.data.description ?? "",
            activityCategories: (activity.data.categories ?? []).filter((category): category is string => category !== null),
            activityImageUrl: activity.data.image ?? ""
          });
        }
      });
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
        };
        robdayLogActivityInstanceProps.push({
          // activityInstance: activityInstance,
          activityInstanceId: activityInstance.id,
          activityInstanceDisplayName: activityInstance.displayName ?? "",
          activityInstanceNotes: (activityInstance.notes ?? []).filter((note): note is string => note !== null),
          activityInstanceRating: activityInstance.rating ?? 0,
          activityInstanceCost: activityInstance.cost ?? 0,
          images: (activityInstance.images ?? []).filter((image): image is string => image !== null),
          // location: location?.data?.name || "",
          locationData: { id: location?.data?.id || "", name: location?.data?.name || "", address: location?.data?.address || "" },
          imageUrls: imageUrls,
          status: activityInstance.status ?? "Planned"

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
        // robdayLogNumber: robdayLog.robDayNumber?.toString() || "",
        robdayLogId: robdayLog.id,
        status: robdayLog.status ?? "Upcoming",
        robdayLogNumber: Number(robdayLog.robDayNumber),
        robdayLogDate: robdayLog.date,
        robdayLogWeather: robdayLog.weatherCondition?.toString() || "",
        robdayLogTemperature: robdayLog.temperature?.valueOf() || 0,
        rating: robdayLog.rating?.valueOf() || 0,
        cost: robdayLog.cost?.valueOf() || 0,
        duration: Number(robdayLog.duration?.valueOf() || 0),
        startTime: robdayLog.startTime?.valueOf() || 0,
        endTime: robdayLog.endTime?.valueOf() || 0,
        totalTime: robdayLog.totalTime?.valueOf() || 0,
        // robdayLogActivities: robdayLogActivities.data,
        // activitiesDict: activitiesDict,
        baseActivities: robdayLogBaseActivityProps,
        // activityInstances: robdayLogActivityInstances.data,
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
    <Agenda
      robdayLogProps={robdayLogProps}
      baseActivityProps={baseActivityProps}
      locationData={locationData}
    />
  )

}


