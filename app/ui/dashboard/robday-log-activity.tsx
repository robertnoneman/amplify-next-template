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


interface RobDayLogActivityProps {
  activityInstance: Schema["ActivityInstance"]["type"];
  // locations: Schema["Location"]["type"][];
  location: string;
  imageUrls: string[];
  // populateActivityInstance: (activityInstance: Schema["ActivityInstance"]["type"]) => void;
}


Amplify.configure(outputs);

const client = generateClient<Schema>();


export default function RobDayLogActivity(
  {
    activityInstance,
    location,
    imageUrls,
    // populateActivityInstance
  }: RobDayLogActivityProps
) {
  const [defaultImageUrl, setDefaultImageUrl] = useState<string>("/poop.jpg");
  const [newImageUrl, setNewImageUrl] = useState<string[]>([]);

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
      id: activityInstance.id,
      images: [...(activityInstance.images ?? []), ...newImageUrl]
    }
    );
    console.log("Update result:", result);
    setNewImageUrl([]);
  }

  return (
    <Column fillWidth>
      <Row>
        <Column fillWidth >
          <Text
              padding="xs" align="left" onBackground="neutral-strong" variant="display-default-xs"
          >
            {activityInstance.displayName?.toUpperCase() ?? "ACTIVITY TBD"}
          </Text>
          <Line/>
          <Text
            paddingLeft="xs" align="left" onBackground="neutral-medium" variant="code-default-xs"
          >
            {/* {((await activityInstance.location())?.data as unknown as string) ?? "LOCATION TBD"} */}
            {location ?? "LOCATION TBD"}
          </Text>
        </Column>
        <Line vertical width={0.1}/>
        <Column fillWidth justifyContent="center">
          <Text
              padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s"
              >
              {activityInstance.notes}
          </Text>
          <Text padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s">
              Rating: {activityInstance.rating}
          </Text>
          <Text padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s">
              Cost: {activityInstance.cost}
          </Text>
        </Column>
        <Column fillHeight justifyContent="flex-start" direction="column">
          <IconButton
              // onClick={() => populateActivityInstance(activityInstance)}
              // name="HiOutlinePencil"
              icon="edit"
              size="m"
              variant="tertiary"
              // onBackground="brand-weak"
          />
        </Column>
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
        <SmartImage
          key={`${imageUrls.indexOf(url)}-${activityInstance.id}-${url}`}
          src={url ?? defaultImageUrl}
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
        />
      ))}
    </Grid>
        
    </Row>
    <Line height={0.1}/>
    <Row fillWidth justifyContent="center" padding="s">
      <MediaUpload
        maxHeight={10}
        maxWidth={8}
        emptyState={<Row paddingBottom="80">Drag and drop or click to browse</Row>}
        onFileUpload={handleUploadData}
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