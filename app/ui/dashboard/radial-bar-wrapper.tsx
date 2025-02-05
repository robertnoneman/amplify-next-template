
import RadialBar from '@/app/ui/dashboard/radial-bar';
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


Amplify.configure(outputs);

const client = generateClient<Schema>();

export default async function RadialBarWrapper() {

    const activities = await client.models.Activity.list();
    const activityInstances = await client.models.ActivityInstance.list();
    const locations = await client.models.Location.list();
    const robdayLogs = await client.models.Robdaylog.list();
    // console.log("Activities fetched: ", activities);
    // console.log("Activity Instances fetched: ", activityInstances);
    // console.log("Locations fetched: ", locations);
    // console.log("Robday Logs fetched: ", robdayLogs);

    const averageRating = Number((activityInstances.data.reduce((acc, activityInstance) => acc + (activityInstance.rating ?? 0), 0) / activityInstances.data.length).toPrecision(2));
    const averageActivityCost = Number((activityInstances.data.reduce((acc, activityInstance) => acc + (activityInstance.cost ?? 0), 0) / activityInstances.data.length).toPrecision(2));

    return (
        <Column justifyContent='center' alignItems='center'>
            <Row mobileDirection="column">
                <RadialBar labels={["ROBDAYS COMPLETED"]} series={[robdayLogs.data.filter((robdayLog) => robdayLog.status === "Completed").length]} />
            </Row>
            <Grid columns="3" mobileColumns="1">
                <RadialBar labels={["AVERAGE ROBDAY RATING"]} series={[99]} height={200} fontSize="14px" />
                <RadialBar labels={["AVERAGE ROBDAY COST"]} series={[25]} colors={["#01CF38", "#FD6325"]} height={200} fontSize="14px" />
                <RadialBar labels={["AVERAGE ACTIVITY RATING"]} series={[averageRating]} colors={["#01CF38", "#FD6325"]} height={200} fontSize="14px" />
                <RadialBar labels={["AVERAGE ACTIVITY COST"]} series={[averageActivityCost]} colors={["#01CF38", "#FD6325"]} height={200} fontSize="14px" />
                <RadialBar labels={["UNIQUE ACTIVITIES DONE"]} series={[12]} colors={["#FD6325"]} height={200} fontSize="14px" />
                <RadialBar labels={["TOTAL ACTIVITIES DONE"]} series={[activityInstances.data.length]} colors={["#FD6325"]} height={200} fontSize="14px" />
            </Grid>
        </Column>
    )
}