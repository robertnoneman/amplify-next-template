"use client";

import {
  Card,
  Row,
  Column,
  Text,
  Background,
  Heading,
  Line,
  Accordion,
  Grid
} from "@/once-ui/components";
import { Gallery } from 'next-gallery';
import { RobdayLogProps, RobDayLogActivityProps, LocationData } from "@/app/lib/definitions";
import { formatDate } from "@/app/lib/utils";
import { useEffect, useState } from "react";

import outputs from "@/amplify_outputs.json"
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { data, type Schema } from "@/amplify/data/resource";
import { getUrl } from 'aws-amplify/storage';
import { MyOverlay, OverlayProvider } from './overlay'
import { MediaUpload } from "@/once-ui/modules";
import { uploadData } from 'aws-amplify/storage';


Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function RobDayLogCard(
  {
    images,
    robdayLogId
  }: {
    images: { src: string, aspect_ratio: number }[];
    robdayLogId: string;
  }
) {
  const [robdayLogData, setRobdayLogData] = useState<RobdayLogProps | null>(null);
  const [locationData, setLocationData] = useState<Schema["Location"]["type"] | null>(null);
  const [activityInstances, setActivityInstances] = useState<Schema["ActivityInstance"]["type"][]>([]);
  const [activityInstanceProps, setActivityInstanceProps] = useState<RobDayLogActivityProps[]>([]);
  const [activityImages, setActivityImages] = useState<{ src: string, aspect_ratio: number }[]>([]);

  const handleUploadData = async (file: File, activityInstanceId: string): Promise<void> => {
    await uploadData({
      path: `picture-submissions/${file.name}`,
      data: file
    });
    const activityInstance = await client.models.ActivityInstance.get({ id: activityInstanceId });
    const images = activityInstance?.data?.images ?? [];
    images.push(`picture-submissions/${file.name}`);
    const result = await client.models.ActivityInstance.update({ id: activityInstanceId, images: images });
    console.log(result);
    fetchRobdayLogData();
  }

  async function fetchRobdayLogData() {
    // setActivityImages([]);
    const robdayLog = (await client.models.Robdaylog.get({ id: robdayLogId })).data;
    const activityInstancesArray: Schema["ActivityInstance"]["type"][] = [];
    const activityInstancesData = await robdayLog?.activityInstances();
    const activityInstancePropsArray: RobDayLogActivityProps[] = [];
    const imageUrls: string[] = [];
    const activityImageUrls: { src: string, aspect_ratio: number }[] = [];
    if (activityInstancesData?.data) {
      await Promise.all(activityInstancesData.data.map(async (activityInstance: Schema["ActivityInstance"]["type"]) => {
        activityInstancesArray.push(activityInstance);
        const location = await activityInstance.location();
        const locationDataProp = { id: location?.data?.id ?? "", name: location?.data?.name ?? "", address: location?.data?.address ?? "" };
        if (activityInstance.images) {
          await Promise.all(activityInstance.images.map(async (key, index) => {
            if (key) {
              const url = `https://amplify-d2e7zdl8lpqran-ma-robdayimagesbuckete97c22-bwldlxhxdd4t.s3.us-east-1.amazonaws.com/${key}`;
              const img = new Image();
              img.src = url;
              await new Promise((resolve) => {
                img.onload = () => {
                  const aspectRatio = img.width / img.height;
                  activityImageUrls.push({ src: url, aspect_ratio: aspectRatio });
                  resolve(null);
                };
              });
              imageUrls.push(url);
              // activityImageUrls.push({ src: url, aspect_ratio: 1/1 });

            }
          }));
        };

        activityInstancePropsArray.push({

          activityInstanceDisplayName: activityInstance.displayName ?? "ACTIVITY TBD",
          locationData: locationDataProp,
          activityInstanceNotes: (activityInstance.notes ?? []).filter((note): note is string => note !== null),
          activityInstanceRating: activityInstance.rating ?? 0,
          activityInstanceCost: activityInstance.cost ?? 0,
          images: [],
          imageUrls: imageUrls,
          status: "Completed",
          activityInstanceId: activityInstance.id ?? "",
        });
      }));
    }

    setActivityImages(activityImageUrls);

    setActivityInstances(activityInstancesArray);
    setActivityInstanceProps(activityInstancePropsArray);

    setRobdayLogData({
      robdayLogId: robdayLog?.id ?? "",
      status: robdayLog?.status ?? "Completed",
      robdayLogDate: robdayLog?.date ?? "",
      robdayLogNumber: robdayLog?.robDayNumber ?? 0,
      robdayLogWeather: robdayLog?.weatherCondition ?? "",
      robdayLogTemperature: robdayLog?.temperature ?? 0,
      rating: robdayLog?.rating ?? 0,
      cost: robdayLog?.cost ?? 0,
      duration: 0,
      startTime: robdayLog?.startTime ?? 0,
      endTime: robdayLog?.endTime ?? 0,
      totalTime: robdayLog?.totalTime ?? 0,
      locationData: [],
      baseActivities: [],
      aiProps: [],
      urlsDict: {},
      notes: (robdayLog?.notes ?? []).filter((note): note is string => note !== null),
    })
  }

  useEffect(() => {
    fetchRobdayLogData();
  }, [robdayLogId]);

  const widths = [200];
  const ratios = [2.2, 4];
  return (
    <Card
      padding="m"
      gap="4"
      marginBottom="xl"
      fillWidth
    >
      <Background
        mask={{
          cursor: true
        }}
        radius="xl"
        position="absolute"
        gradient={{
          display: true,
          opacity: 30,
          tilt: 0,
          height: 200,
          width: 120,
          x: 0,
          y: 0,
          colorStart: "accent-solid-strong",
          colorEnd: "neutral-alpha-weak",
        }}
      />
      {/* <Line height={0.25}/> */}
      <Heading variant="display-default-m" align="center">
        ROBDAY #{robdayLogData?.robdayLogNumber}
      </Heading>
      <Line height={0.25} />
      <Text variant="body-default-xs">{formatDate(robdayLogData?.robdayLogDate ?? '')}</Text>
      <Text variant="body-default-xs">Weather: {robdayLogData?.robdayLogWeather} - {robdayLogData?.robdayLogTemperature}°</Text>
      <Line height={0.1} />
      <Column fillWidth fillHeight>
        <OverlayProvider>
          <Gallery {...{ images: activityImages, widths, ratios }} lastRowBehavior="fill" overlay={(i) => <MyOverlay index={i} src={activityImages[i].src} aspect_ratio={activityImages[i].aspect_ratio} />} />
        </OverlayProvider>
      </Column>
      {(activityInstanceProps ?? []).map((activityInstance, index) => (
        <Row key={index}>
          <Column fillWidth >
            <Text padding="xs" align="left" onBackground="neutral-strong" variant="display-default-xs">
              {activityInstance.activityInstanceDisplayName?.toUpperCase() ?? "ACTIVITY TBD"}
            </Text>
            <Text paddingLeft="xs" align="left" onBackground="neutral-medium" variant="code-default-xs">
              {activityInstance.locationData?.name.toUpperCase() ?? "LOCATION TBD"}
            </Text>
            <Row fillWidth height="32" justifyContent="center" gap="8">
              {/* <Text variant="body-default-xs" wrap="nowrap" align="center">
                Add Image
              </Text> */}
              <MediaUpload
                emptyState={<Row paddingBottom="2">Drag and drop or click to browse</Row>}
                onFileUpload={(file) => handleUploadData(file, activityInstance.activityInstanceId)}
                initialPreviewImage=""
              >
              </MediaUpload>
            </Row>
            <Accordion title="DETAILS">
              <Column fillWidth fillHeight>
                <Row>
                  <Column width={6}>
                    <Text padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s">
                      RATING
                    </Text>
                  </Column>
                  <Line vertical width={0.1} />
                  <Column fillWidth justifyContent="center">
                    <Text padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s">
                      {activityInstance?.activityInstanceRating}
                    </Text>
                  </Column>
                </Row>
                <Line />
                <Row>
                  <Column width={6}>
                    <Text padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s">
                      COST
                    </Text>
                  </Column>
                  <Line vertical width={0.1} />
                  <Column fillWidth justifyContent="center">
                    <Text padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s">
                      {activityInstance?.activityInstanceCost}
                    </Text>
                  </Column>
                </Row>
                <Line />
                <Row >
                  <Column width={6}>
                    <Text padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s">
                      NOTES
                    </Text>
                  </Column>
                  <Line vertical width={0.1} />
                  <Column fillWidth justifyContent="center">
                    {(activityInstance?.activityInstanceNotes ?? []).map((note, index) => (
                      <Text padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s" key={index}>
                        {note}
                      </Text>
                    ))}
                  </Column>
                </Row>
              </Column>
            </Accordion>
            <Line height={0.1} />
          </Column>
        </Row>
      ))}
      {/* <Accordion
        title="DETAILS"
      >
        <Column fillWidth fillHeight>
          <Row >
            <Column width={6}>
              <Text
                padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s"
              >
                
                NOTES
              </Text>
            </Column>
            <Line vertical width={0.1} />
            <Column fillWidth justifyContent="center">
              {(robdayLogData?.notes ?? []).map((note, index) => (
                <Text
                  padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s" key={index}
                >
                  {note}
                </Text>
              ))}
            </Column>
          </Row>
          <Line />
          <Row>
            <Column width={6}>
              <Text padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s">
                
                RATING
              </Text>
            </Column>
            <Line vertical width={0.1} />
            <Column fillWidth justifyContent="center">
              <Text padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s">
                
                {robdayLogData?.rating}
              </Text>
            </Column>
          </Row>
          <Line />
          <Row>
            <Column width={6}>
              <Text padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s">
                COST
              </Text>
            </Column>
            <Line vertical width={0.1} />
            <Column fillWidth justifyContent="center">
              <Text padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s">
                {robdayLogData?.cost}
              </Text>
            </Column>
          </Row>
        </Column>
      </Accordion> */}

      {/* <Heading variant="display-default-xs" align="left">
        ACTIVITIES
      </Heading>
      <Line height={0.1} />
      <Row>
        <Column>
          <Text variant="display-default-xs">Sucked it</Text>
          <Text variant="body-default-xs">Location: Your Mom's House</Text>
          <Text variant="body-default-xs">Rating: 99</Text>
          <Text variant="body-default-xs">Cost: She paid me actually</Text>
        </Column>
        <Column>
          <Text>Notes</Text>
          <Text variant="body-default-xs">I've had better</Text>
        </Column>
      </Row> */}
      {/* <Column fillWidth fillHeight>
        <Gallery {...{ images, widths, ratios }} lastRowBehavior="fill" />
      </Column> */}
    </Card>
  )
}