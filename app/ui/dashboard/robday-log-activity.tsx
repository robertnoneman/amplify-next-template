"use client";

import { act, useEffect, useState } from "react";

import {
  Heading,
  Text,
  Button,
  Icon,
  InlineCode,
  Logo,
  Input,
  Avatar,
  AvatarGroup,
  Textarea,
  PasswordInput,
  SegmentedControl,
  SmartLink,
  Dialog,
  Feedback,
  SmartImage,
  Line,
  LogoCloud,
  Background,
  Select,
  useToast,
  Card,
  Fade,
  StatusIndicator,
  DateRangePicker,
  DateRange,
  TiltFx,
  HoloFx,
  IconButton,
  TagInput,
  Switch,
  Column,
  Row,
  StyleOverlay,
  Flex,
  DateInput,
  Skeleton,
  Arrow,
  Grid
} from "@/once-ui/components";

import { uploadData } from 'aws-amplify/storage';
import { getImageUrl } from "@/app/lib/utils";
import { MediaUpload } from "@/once-ui/modules";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { RobDayLogActivityProps, 
  LocationData, 
  // RobDayLogBaseActivityProps
} from "@/app/lib/definitions";


// interface RobDayLogActivityProps {
//   // activityInstance: Schema["ActivityInstance"]["type"];
//   activityInstanceId: string;
//   activityInstanceDisplayName: string;
//   activityInstanceNotes: string[];
//   activityInstanceRating: number;
//   activityInstanceCost: number;
//   images: string[];
//   // locations: Schema["Location"]["type"][];
//   location: string;
//   imageUrls: string[];
//   // populateActivityInstance: (activityInstance: Schema["ActivityInstance"]["type"]) => void;
// }


Amplify.configure(outputs);

const client = generateClient<Schema>();


export default function RobDayLogActivity(
  {
    // activityInstance,
    activityInstanceId,
    activityInstanceDisplayName,
    activityInstanceNotes,
    activityInstanceRating,
    activityInstanceCost,
    images,
    locationData,
    imageUrls,
    // populateActivityInstance
  }: RobDayLogActivityProps
) {
  const [defaultImageUrl, setDefaultImageUrl] = useState<string>("/poop.jpg");
  const [newImageUrl, setNewImageUrl] = useState<string[]>([]);
  const [newImageUrls, setNewImageUrls] = useState<string[]>([]);

  const handleUploadData = async (file: File): Promise<void> => {
    await uploadData({
        path: `picture-submissions/${file.name}`, 
        data: file
    });
          // setActivityImages(prevImages => [...prevImages, `picture-submissions/${file.name}`])
        // setActivityImages([`picture-submissions/${file.name}`]);
    setNewImageUrl([`picture-submissions/${file.name}`]);
  }

  async function updateActivityInstance() {
    console.log("Updating activity instance");
    const result = await client.models.ActivityInstance.update({
      // id: activityInstance.id,
      id: activityInstanceId,
      // images: [...(activityInstance.images ?? []), ...newImageUrl]
      images: [...(images ?? []), ...newImageUrl]
    }
    );
    console.log("Update result:", result);
    setNewImageUrl([]);
  }

  const addPhotoToActivityInstance = async (file: File): Promise<void> => {
    handleUploadData(file);
    const key = `picture-submissions/${file.name}`;
    const myimages = images ? images : [];
    myimages.push(key);
    const result = client.models.ActivityInstance.update({ id: activityInstanceId, images: myimages });
    console.log("Activity Instance updated: ", result);
    const url = await getImageUrl(key);
    if (url) {
      newImageUrls.push(url);
    }
  }

  return (
    <Column fillWidth>
      <Row>
        <Column fillWidth >
          <Text
              padding="xs" align="left" onBackground="neutral-strong" variant="display-default-xs"
          >
            {activityInstanceDisplayName?.toUpperCase() ?? "ACTIVITY TBD"}
          </Text>
          <Line/>
          <Text
            paddingLeft="xs" align="left" onBackground="neutral-medium" variant="code-default-xs"
          >
            {/* {((await activityInstance.location())?.data as unknown as string) ?? "LOCATION TBD"} */}
            {locationData?.name ?? "LOCATION TBD"}
          </Text>
        </Column>
        <Line vertical width={0.1}/>
        <Column fillWidth justifyContent="center">
          <Text
              padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s"
              >
              {activityInstanceNotes}
          </Text>
          <Text padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s">
              Rating: {activityInstanceRating}
          </Text>
          <Text padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s">
              Cost: {activityInstanceCost}
          </Text>
        </Column>
        {/* <Column fillHeight justifyContent="flex-start" direction="column">
          <IconButton
              // onClick={() => populateActivityInstance(activityInstance)}
              // name="HiOutlinePencil"
              icon="edit"
              size="m"
              variant="tertiary"
              // onBackground="brand-weak"
          />
        </Column> */}
      </Row>
      <Line height={0.1}/>
      <Row fillWidth justifyContent="space-around" padding="s">
      <Grid 
        fillWidth
        columns="4"
        padding="16"
        gap="8"
        mobileColumns='1'
        >
        
        {/* <SmartImage
          src={(imageUrls && imageUrls[0]) ?? defaultImageUrl}
          alt="Robday"
          // aspectRatio="1/1"
          objectFit="cover"
          sizes="s"
          radius="xl"
          // width={15}
          // fillWidth
          maxWidth="l"
          minHeight="l"
          // height={15}
        /> */}
  
      {imageUrls.map((url) => (
        <Column key={`${imageUrls.indexOf(url)}-${activityInstanceId}-${url}col`} 
          fillWidth 
          justifyContent="center"
          >
        <SmartImage
          key={`${imageUrls.indexOf(url)}-${activityInstanceId}-${url}img`}
          src={url ?? defaultImageUrl}
          alt="Robday"
          // aspectRatio="1/1"
          objectFit="cover"
          sizes="s"
          radius="xl"
          // width={15}
          // fillWidth
          maxWidth="l"
          minHeight="xs"
          // height={15}
        />
        </Column>
      ))}
      {newImageUrls.map((url) => (
        <Column key={`${newImageUrls.indexOf(url)}-${activityInstanceId}-${url}col`}
          fillWidth 
          justifyContent="center"
          >
        <SmartImage
          key={`${newImageUrls.indexOf(url)}-${activityInstanceId}-${url}img`}
          src={url ?? defaultImageUrl}
          alt="Robday"
          // aspectRatio="1/1"
          objectFit="cover"
          sizes="s"
          radius="xl"
          // width={15}
          // fillWidth
          maxWidth="l"
          minHeight="xs"
          // height={15}
        />
        </Column>
      ))}
    </Grid>
        
    </Row>
    <Line height={0.1}/>
    <Row fillWidth justifyContent="center" padding="s">
      <MediaUpload
        maxHeight={10}
        maxWidth={8}
        emptyState={<Row paddingBottom="80">Drag and drop or click to browse</Row>}
        // onFileUpload={handleUploadData}
        onFileUpload={addPhotoToActivityInstance}
        // initialPreviewImage="/placeholderImage.jpg"
      />
      { newImageUrl.length > 0 &&
      <Button
        variant="primary"
        size="m"
        onClick={updateActivityInstance}
      >
        UPLOAD
      </Button>
      }
    </Row>
    <Line height={0.1}/>
  </Column>
  );
}