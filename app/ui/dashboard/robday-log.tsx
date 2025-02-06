"use client";

import { act, SetStateAction, useEffect, useState } from "react";

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
  RevealFx,
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
  Arrow
} from "@/once-ui/components";
import { CodeBlock, MediaUpload } from "@/once-ui/modules";
import Link from 'next/link';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import clsx from 'clsx';
import { roboto } from '@/app/ui/fonts';
import { usePathname } from 'next/navigation';
import { getNextRobDay } from "@/app/lib/utils";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { getUrl } from 'aws-amplify/storage';
import { uploadData } from 'aws-amplify/storage';
import { Nullable } from "@aws-amplify/data-schema";
import { AuthMode, CustomHeaders, LazyLoader, ListReturnValue, SingularReturnValue } from "@aws-amplify/data-schema/runtime";
import RobDayLogActivity from "./robday-log-activity";
import { RobDayLogActivityProps,
  RobdayLogProps,
  LocationData, 
  // RobDayLogBaseActivityProps
} from "@/app/lib/definitions";

Amplify.configure(outputs);

const client = generateClient<Schema>();

// interface RobDayLogActivityProps {
//   // activityInstance: Schema["ActivityInstance"]["type"];
//   activityInstanceId: string;
//   activityInstanceDisplayName: string;
//   activityInstanceNotes: string[];
//   activityInstanceRating: number;
//   activityInstanceCost: number;
//   images: string[];
//   location: string;
//   imageUrls: Array<string>;
//   // populateActivityInstance: (activityInstance: Schema["ActivityInstance"]["type"]) => void;
// }

// interface LocationData {
//   id: string;
//   name: string;
//   address: string;
// }

interface RobDayLogBaseActivityProps {
  activityId: string;
  activityName: string;
  activityDescription: string;
  activityCategories: string[];
  activityImageUrl: string;
}


export default function RobdayLog({ 
  robdayLogNumber,
  robdayLogDate,
  robdayLogId,
  robdayLogWeather,
  robdayLogTemperature,
  // robdayLogActivities,
  // activitiesDict,
  // activityInstances,
  baseActivities,
  robdayLogActivityProps,
  urlsDict,
  notes,
  locationData,
  robDayLogProp
  // locations
}: { 
  robdayLogNumber: Number; 
  robdayLogDate: string;
  robdayLogId: string;
  robdayLogWeather: string;
  robdayLogTemperature: number;
  // robdayLogActivities: Schema["RobdaylogActivity"]["type"][];
  // activitiesDict: Record<string, Schema["Activity"]["type"]>;
  // activityInstances: Schema["ActivityInstance"]["type"][];
  robdayLogActivityProps: RobDayLogActivityProps[];
  baseActivities: RobDayLogBaseActivityProps[];
  urlsDict: Record<string, string>;
  notes: Array<string>;
  locationData: LocationData[];
  robDayLogProp: RobdayLogProps;
  // locations: Schema["Location"]["type"][];
}) {

  const [location, setLocation] = useState<string | null>(null);
  // const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string[]>>({});
  const [defaultImageUrl, setDefaultImageUrl] = useState<string>("/poop.jpg");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  // const [editedActivity, setEditedActivity] = useState<Schema["ActivityInstance"]["type"] | null>(null);
  const [editedActivity, setEditedActivity] = useState<RobDayLogActivityProps>();
  const [editedImageUrl, setEditedImageUrl] = useState<string>("");
  const [activityDisplayName, setActivityDisplayName] = useState<string>("");
  const [activityLocationId, setActivityLocationId] = useState<string>("");
  const [activityNotes, setActivityNotes] = useState<string[]>([]);
  const [activityImages, setActivityImages] = useState<string[]>([]);
  const [activityCost, setActivityCost] = useState<number>(0);
  const [activityRating, setActivityRating] = useState<number>(0);
  // const [robdayLogActivityProps, setRobdayLogActivityProps] = useState<Array<RobDayLogActivityProps>>([]);

  const [selectedLocationValue, setSelectedLocationValue] = useState("");
  const [selectedLocationValueLabel, setSelectedLocationValueLabel] = useState("Choose a location");
  // const [selectedLocation, setSelectedLocation] = useState<Schema["Location"]["type"]>();
  const [selectedLocation, setSelectedLocation] = useState<LocationData>();

  // const [selectedActivity, setSelectedActivity] = useState<Schema["Activity"]["type"]>();
  const [selectedActivity, setSelectedActivity] = useState<RobDayLogBaseActivityProps>();
  const [editVisible, setEditVisible] = useState(false);
  const [isCreateNewLocationDialogOpen, setIsCreateNewLocationDialogOpen] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationAddress, setNewLocationAddress] = useState("");
  

  const getImageUrl = async (key: string): Promise<string> => {
      const url = getUrl({
          path: key
      });
        return (await url).url.toString();
  }

  function formatDate(date: string) {
    // add a day to the date because... timezones
    const dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() + 1);
    // console.log(date)
    return dateObj.toLocaleDateString("en-US", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  const handleUploadData = async (file: File): Promise<void> => {
      const result = await uploadData({
          path: `picture-submissions/${file.name}`, 
          data: file
      }).result;
      console.log("File uploaded: ", result);
        // setActivityImages(prevImages => [...prevImages, `picture-submissions/${file.name}`])
      setActivityImages([`picture-submissions/${file.name}`]);
  }
  
  const handleSelectLocation = (location: LocationData) => {
      console.log("Selected option:", location.name);
      setSelectedLocationValue(location.name ?? "");
      setSelectedLocationValueLabel(location.address ?? "");
      setSelectedLocation(location);
    }
  
  // function updateActivityInstance(activityInstance: Schema["ActivityInstance"]["type"]) {
  //   console.log(`Done Editing Activity: ${activityInstance.displayName}`);
  //   activityInstance.displayName = activityDisplayName;
  //   activityInstance.notes = activityNotes;
  //   activityInstance.images = activityImages;
  //   activityInstance.cost = activityCost;
  //   activityInstance.rating = activityRating;
  //   // activityInstance.locationId = activityLocationId;
  //   // selectedLocation ? activityInstance.locationId = selectedLocation.id : null;
  //   // if (selectedLocation) {
  //   //   const result = client.models.ActivityInstance.update({ id: activityInstance.id, locationId: selectedLocation.id });
  //   //   console.log("Activity Instance updated: ", result);
  //   // }
  //   const fullResult = client.models.ActivityInstance.update(activityInstance);
  //   console.log("Activity Instance updated: ", fullResult);
  //   setIsEditDialogOpen(false);
  //   setActivityDisplayName("");
  //   setActivityLocationId("");
  //   setActivityNotes([]);
  //   setActivityImages([]);
  //   setActivityCost(0);
  //   setActivityRating(0);
  // }

  function updateActivityInstance(activityInstance: RobDayLogActivityProps) {
    console.log(`Done Editing Activity: ${activityInstance.activityInstanceDisplayName}`);
    activityInstance.activityInstanceDisplayName = activityDisplayName;
    activityInstance.activityInstanceNotes = activityNotes;
    activityInstance.images = activityImages;
    activityInstance.activityInstanceCost = activityCost;
    activityInstance.activityInstanceRating = activityRating;
    // activityInstance.locationId = activityLocationId;
    // selectedLocation ? activityInstance.locationId = selectedLocation.id : null;
    // if (selectedLocation) {
    //   const result = client.models.ActivityInstance.update({ id: activityInstance.id, locationId: selectedLocation.id });
    //   console.log("Activity Instance updated: ", result);
    // }
    const fullResult = client.models.ActivityInstance.update({
      id: activityInstance.activityInstanceId, 
      displayName: activityInstance.activityInstanceDisplayName, 
      notes: activityInstance.activityInstanceNotes, 
      images: activityInstance.images, 
      cost: activityInstance.activityInstanceCost, 
      rating: activityInstance.activityInstanceRating, 
      locationId: selectedLocation?.id ?? ""});
    console.log("Activity Instance updated: ", fullResult);
    setIsEditDialogOpen(false);
    setActivityDisplayName("");
    setActivityLocationId("");
    setActivityNotes([]);
    setActivityImages([]);
    setActivityCost(0);
    setActivityRating(0);
    setSelectedLocation(undefined);
  }
  
  // function populateActivityInstance(activityInstance: Schema["ActivityInstance"]["type"]) {
  // // function populateActivityInstance(activityInstance: RobDayLogActivityProps) {
  //   isEditDialogOpen? console.log("returning ") :
  //   setIsEditDialogOpen(true);
  //   setEditedActivity(activityInstance);
  //   activityInstance.displayName? setActivityDisplayName(activityInstance.displayName) : setActivityDisplayName("");
  //   // activityInstance.locationId? setActivityLocationId(activityInstance.locationId) : setActivityLocationId("");
  //   activityInstance.locationId? setSelectedLocationValue(locationData.find((location) => location.id === activityInstance.locationId)?.name ?? "") : setSelectedLocationValue("");
  //   activityInstance.locationId? setSelectedLocationValueLabel(locationData.find((location) => location.id === activityInstance.locationId)?.address ?? "") : setSelectedLocationValueLabel("");
  //   setActivityNotes(activityInstance.notes ? activityInstance.notes.filter((note): note is string => note !== null) : []);
  //   activityInstance.images? setActivityImages(activityInstance.images.filter((image): image is string => image !== null)) : setActivityImages([]);
  //   activityInstance.cost? setActivityCost(activityInstance.cost) : setActivityCost(0);
  //   activityInstance.rating? setActivityRating(activityInstance.rating) : setActivityRating(0);
  //   setEditedImageUrl(imageUrls[activityInstance.id][0] ?? defaultImageUrl);
  //   console.log("Activity Instance populated: ", activityInstance.displayName);
  // }

  function populateActivityInstance(activityInstance: RobDayLogActivityProps) {
    isEditDialogOpen? console.log("returning ") :
    setIsEditDialogOpen(true);
    setEditedActivity(activityInstance);
    activityInstance.activityInstanceDisplayName? setActivityDisplayName(activityInstance.activityInstanceDisplayName) : setActivityDisplayName("");
    // activityInstance.locationId? setActivityLocationId(activityInstance.locationId) : setActivityLocationId("");
    activityInstance.locationData? setSelectedLocationValue(activityInstance.locationData.name) : setSelectedLocationValue("");
    setSelectedLocation(activityInstance.locationData ? locationData.find((location) => location.name === activityInstance.locationData.name) : locationData[0]);
    // activityInstance.locationId? setSelectedLocationValueLabel(locationData.find((location) => location.id === activityInstance.locationId)?.address ?? "") : setSelectedLocationValueLabel("");
    setSelectedLocationValueLabel(locationData.find((location) => location.name === activityInstance.locationData.address)?.address ?? "");
    setActivityNotes(activityInstance.activityInstanceNotes ? activityInstance.activityInstanceNotes.filter((note): note is string => note !== null) : []);
    activityInstance.images? setActivityImages(activityInstance.images.filter((image): image is string => image !== null)) : setActivityImages([]);
    activityInstance.activityInstanceCost? setActivityCost(activityInstance.activityInstanceCost) : setActivityCost(0);
    activityInstance.activityInstanceRating? setActivityRating(activityInstance.activityInstanceRating) : setActivityRating(0);
    // setEditedImageUrl(imageUrls[activityInstance.activityInstanceId][0] ?? defaultImageUrl);
    // setEditedImageUrl(imageUrls[activityInstance.activityInstanceId][0] ?? defaultImageUrl);
    setEditedImageUrl(activityInstance.imageUrls[0] ?? defaultImageUrl);
    console.log("Activity Instance populated: ", activityInstance.activityInstanceDisplayName);
  }

  // async function populateNewActivityInstance(activity: Schema["Activity"]["type"]) {
  //   isAddDialogOpen? console.log("returning ") :
  //   setIsAddDialogOpen(true);
  //   setSelectedActivity(activity);
  //   setActivityDisplayName(activity?.name ?? "");
  //   setSelectedLocationValue(activity?.location ?? "");
  //   setSelectedLocationValueLabel(activity?.location ?? "");
  //   setActivityNotes([]);
  //   const imageUrl = await getImageUrl(activity.image ?? "/placeholderImage.jpg");
  //   setEditedImageUrl(imageUrl);
  //   setActivityImages([activity.image ?? ""]);
  //   setActivityCost(activity.cost ?? 0);
  //   setActivityRating(activity.rating ?? 0);
  //   console.log("Activity Instance populated: ", activity.name);
  // }

  async function populateNewActivityInstance(activity: RobDayLogBaseActivityProps) {
    isAddDialogOpen? console.log("returning ") :
    setIsAddDialogOpen(true);
    setSelectedActivity(activity);
    setActivityDisplayName(activity?.activityName ?? "");
    // setSelectedLocationValue(activity?.activityLocation ?? "");
    // setSelectedLocationValueLabel(activity?.location ?? "");
    setActivityNotes([]);
    // const imageUrl = await getImageUrl(activity.image ?? "/placeholderImage.jpg");
    // setEditedImageUrl(imageUrl);
    // setActivityImages([activity.image ?? ""]);
    // setActivityCost(activity.act ?? 0);
    // setActivityRating(activity.rating ?? 0);
    console.log("Activity Instance populated: ", activity.activityName);
  }

  // function createActivityInstance() {
  //   console.log(`Done Creating Activity: ${selectedActivity?.name}`);
  //   const newActivityInstance = {
  //     displayName: activityDisplayName,
  //     notes: activityNotes,
  //     images: activityImages,
  //     cost: activityCost,
  //     rating: activityRating,
  //     activityId: selectedActivity?.id ?? "",
  //     locationId: selectedLocation?.id ?? "",
  //     // robdaylogId: robdayLogActivities[0].robdaylogId,
  //     robdaylogId: robdayLogId,
  //     completed: true,
  //     isOnNextRobDay: false,
  //     date: robdayLogDate,
  //   }
  //   const result = client.models.ActivityInstance.create(newActivityInstance);
  //   console.log("Activity Instance created: ", result);
  //   setIsAddDialogOpen(false);
  //   setActivityDisplayName("");
  //   setActivityLocationId("");
  //   setActivityNotes([]);
  //   setActivityImages([]);
  //   setEditedImageUrl("/placeholderImage.jpg");
  //   setActivityCost(0);
  //   setActivityRating(0);
  // }

  function createActivityInstance() {
    console.log(`Done Creating Activity: ${selectedActivity?.activityName}`);
    const newActivityInstance = {
      displayName: activityDisplayName,
      notes: activityNotes,
      images: activityImages,
      cost: activityCost,
      rating: activityRating,
      activityId: selectedActivity?.activityId ?? "",
      locationId: selectedLocation?.id ?? "",
      // robdaylogId: robdayLogActivities[0].robdaylogId,
      robdaylogId: robdayLogId,
      completed: true,
      isOnNextRobDay: false,
      date: robdayLogDate,
    }
    const result = client.models.ActivityInstance.create(newActivityInstance);
    console.log("Activity Instance created: ", result);
    setIsAddDialogOpen(false);
    setActivityDisplayName("");
    setActivityLocationId("");
    setActivityNotes([]);
    setActivityImages([]);
    setEditedImageUrl("/placeholderImage.jpg");
    setActivityCost(0);
    setActivityRating(0);
  }


  async function fetchDefaultImage() {
    const defImageUrl = await getImageUrl("picture-submissions/placeholderImage.jpg");
    setDefaultImageUrl(defImageUrl);
  }

  function createNewLocation() {
    const newLocation = {
      name: newLocationName,
      address: newLocationAddress,
    };
    const location = client.models.Location.create({ ...newLocation });
    console.log("Location created: ", location);
    // setAddedLocation(location);
    // setSelectedLocation(location);
    // setSelectedLocationValue("");
    // setSelectedLocationValueLabel("Choose a location");
    setIsCreateNewLocationDialogOpen(false);
  }

  function handleCreateNewLocation() {
    setSelectedLocationValue("");
    setSelectedLocationValueLabel("Choose a location");
    setIsCreateNewLocationDialogOpen(true);
  }

  // useEffect(() => {
  //   // fetchDefaultImage();
  //   const rdlaProps: SetStateAction<RobDayLogActivityProps[]> = [];
  //   activityInstances?.forEach(async (activityInstance) => {
  //     const location = await activityInstance.location();
  //     const aiImages: Array<string> = [];
  //     const baseActivity = await client.models.Activity.get({ id: activityInstance.activityId });
  //     const baseActivityImages = baseActivity.data?.image;
  //     const url2 = await getImageUrl(baseActivityImages ?? "picture-submissions/placeholderImage.jpg");
  //     aiImages.push(url2 ?? "picture-submissions/placeholderImage.jpg");
  //     activityInstance.images?.forEach(async (image, index) => {
  //       if (image) {
  //         const url = await getImageUrl(image);
  //         // aiImages.push(url);
  //         aiImages[index] = url;
  //       }
  //     });
  //     const aiProp = {
  //       activityInstance: activityInstance,
  //       location: location.data?.name ?? "",
  //       imageUrls: aiImages,
  //       // populateActivityInstance: populateActivityInstance
  //     }
  //     rdlaProps.push(aiProp);
  //     setLocation(location.data?.name ?? null);
  //     // console.log("Location: ", location.data?.name);
  //   });
  //   console.log("ROBDAY LOG ACTIVITY PROPS: ", rdlaProps);
  //   setRobdayLogActivityProps(rdlaProps);
  //   // listLocations();
  // }, []);

  return (
    <Row
      fillWidth 
      transition="macro-medium"
      gap="64"
      position="relative"
      overflow="hidden"
    >
      <Column
        background="surface"
        padding="s"
        gap="xs"
        border="neutral-medium"
        radius="xl"
        fillWidth
        fillHeight>
        {/* <Background
          mask={{
           cursor: true
          }}
          radius="xl"
          position="absolute"
          gradient={{
            display: true,
            opacity: 50,
            tilt: -5,
            height: 200,
            width: 120,
            x: 120,
            y: 35,
            colorStart: "brand-solid-strong",
            colorEnd: "brand-alpha-weak",
          }}
        /> */}
        <Background
          mask={{
            // x: 100,
            // y: 0,
            // radius: 100,
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
          ROBDAY #{robdayLogNumber.toString()}
        </Heading>
        <Line height={0.25}/>
        { formatDate(robdayLogDate) } <br></br>
        {robdayLogWeather} - {robdayLogTemperature}°<br></br>

        <Line height={0.1}/>
        {notes.map((note) => (
          <Text
            key={note}
            padding="xs"
            align="left"
            onBackground="neutral-strong"
            variant="body-default-s"
          >
            {note}
          </Text>
        ))}
        <Line height={0.1}/>
        
        <Column>
          {/* {activityInstances && Object.entries(activityInstances).map(([id, activityInstance]) => (
            <RobDayLogActivity key={`${activityInstance.id} - ${id}`} activityInstance={activityInstance} imageUrls={imageUrls}  />
          ))} */}
          {robdayLogActivityProps.map((props) => (
            <Row  
              key={`${props.activityInstanceId}`} 
              onMouseEnter={() => setEditVisible(true)}
              onMouseLeave={() => setEditVisible(false)}
              >
              <RobDayLogActivity key={`${props.activityInstanceId}`} {...props} />
              {editVisible && (
                <Column style={{width: "90%"}} justifyContent="center" direction="column" position="absolute" alignItems="flex-end">
                  <RevealFx>
                    <IconButton
                        onClick={() => populateActivityInstance(props)}
                        // name="HiOutlinePencil"
                        icon="edit"
                        size="m"
                        variant="tertiary"
                        // onBackground="brand-weak"
                    />
                  </RevealFx>
                </Column>
              )}
              {/* <Column fillHeight justifyContent="flex-start" direction="column">
                <IconButton
                    onClick={() => populateActivityInstance(props)}
                    // name="HiOutlinePencil"
                    icon="edit"
                    size="m"
                    variant="tertiary"
                    // onBackground="brand-weak"
                />
                </Column> */}
            </Row>
          ))}
          <Heading variant="display-default-xs" align="center">
            AGENDA ACTIVITIES
          </Heading>
          <Line/>
          { baseActivities.map((activity) => (
            <Row key={`${activity.activityId}`}>
              <Column>
              <Text
                padding="xs"
                align="left"
                onBackground="neutral-strong"
                variant="body-default-m"
              >
                {activity.activityName}
              </Text>
              <Line/>
              <Text
                paddingLeft="xs"
                align="left"
                onBackground="neutral-medium"
                variant="body-default-s"
              >
                {activity.activityDescription}
              </Text>
              <Line/>
              </Column>
              {robdayLogActivityProps.length !== baseActivities.length && (
              <Column fillHeight justifyContent="flex-start" direction="column">
                <IconButton
                  onClick={() => populateNewActivityInstance(activity)}
                  // name="HiOutlinePencil"
                  icon="plus"
                  size="m"
                  variant="tertiary"
                  // onBackground="brand-weak"
                ></IconButton>
              </Column>
              )}
            </Row>
          ))}
          {/* {activitiesDict && Object.entries(activitiesDict).map(([id, activity]) => (
            <Column key={`${activity.id}${id}`} fillWidth>
              <Row>
              <Column
                position="relative"
                overflow="hidden"
                width={20}
              >
                <SmartImage
                  src={urlsDict[id] ?? ""}
                  alt="Robday"
                  aspectRatio="1/1"
                  objectFit="contain"
                  sizes="s"
                  radius="xl"
                  width={10}
                  height={10}
                />
              </Column>
              <Column fillWidth >
                <Text
                  padding="xs" align="left" onBackground="neutral-strong" variant="display-default-xs"
                >
                  {activity.name?.toUpperCase() ?? "ACTIVITY TBD"}
                </Text>
                <Line/>
                <Text
                  paddingLeft="xs" align="left" onBackground="neutral-medium" variant="code-default-xs"
                >
                  {activity.location?.toUpperCase() ?? "LOCATION TBD"}
                </Text>
                
              </Column>
              <Line vertical width={0.1}/>
              <Column fillWidth justifyContent="center">
                <Text
                    padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s"
                  >
                  {activity.description}
                </Text>
              </Column>
              <Column fillHeight justifyContent="flex-start" direction="column">
                <IconButton
                  onClick={() => populateNewActivityInstance(activity)}
                  // name="HiOutlinePencil"
                  icon="plus"
                  size="m"
                  variant="tertiary"
                  // onBackground="brand-weak"
                ></IconButton>
              </Column>
            </Row>
            <Line height={0.1}/>
          </Column>
          ))} */}
        </Column>
      </Column>
      <Dialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          title="Edit Robday Activity"
          description="Edit Robday activity."
          // onHeightChange={(height) => setFirstDialogHeight(height)}
          footer={
            <>
              <Button variant="secondary" onClick={() => editedActivity && updateActivityInstance(editedActivity)}>
                Update
              </Button>
            </>
          }
        >
          <Flex
            fillWidth
            alignItems='center'
            justifyContent='center'
          >
            <Flex
              maxWidth={20}
              alignItems='center'
            >
              <MediaUpload
                emptyState={<Row paddingBottom="80">Drag and drop or click to browse</Row>}
                onFileUpload={handleUploadData}
                initialPreviewImage={editedActivity ? editedImageUrl : ""}
              >  
              </MediaUpload>
            </Flex>
          </Flex>
          <Column paddingTop="24" fillWidth gap="24">
            <Input
              radius="top"
              label="Name"
              // labelAsPlaceholder
              // defaultValue={editedActivity?.displayName?.toString() ?? ""}
              defaultValue={editedActivity?.activityInstanceDisplayName?.toString() ?? ""}
              id="name"
              // onChange={(e) => console.log(e.target.value)}
              onChange={(e) => setActivityDisplayName(e.target.value)}
            />
            <Select
              searchable
              id="location"
              label={selectedLocationValueLabel}
              minHeight={300}
              options={locationData.map((location) => {
                return { value: location.id, label: location.name, description: location.address }
              })}
              onSelect={(value) => handleSelectLocation(locationData.find((location) => location.id === value ) ?? locationData[0])}
              value={selectedLocationValue}
            />
            <Input
              radius="top"
              label="Cost"
              // labelAsPlaceholder
              // defaultValue={editedActivity?.cost?.toString()}
              defaultValue={editedActivity?.activityInstanceCost?.toString()}
              id="cost"
              // onChange={(e) => console.log(e.target.value)}
              onChange={(e) => setActivityCost(parseInt(e.target.value))}
            />
            <Input
              radius="top"
              label="Rating"
              // labelAsPlaceholder
              // defaultValue={editedActivity?.rating?.toString()}
              defaultValue={editedActivity?.activityInstanceRating?.toString()}
              id="rating"
              // onChange={(e) => console.log(e.target.value)}
              onChange={(e) => setActivityRating(parseInt(e.target.value))}
            />
            {/* {editedActivity && editedActivity.notes && editedActivity.notes.map((note) => ( */}
            {editedActivity && editedActivity.activityInstanceNotes && editedActivity.activityInstanceNotes.map((note) => (
              <Textarea
                // key={`${editedActivity.id} - ${note}`}
                key={`${editedActivity.activityInstanceId} - ${note}`}
                id="notes"
                label="Notes"
                defaultValue={note?.toString() ?? ""}
                lines={2}
                // onChange={(e) => console.log(e.target.value)}
                // append to notes array
                onChange={(e) => setActivityNotes([e.target.value])}
              >
              </Textarea>
            ))}
          </Column>
        </Dialog>
        <Dialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          title="Add Robday Activity"
          description="Add Robday activity."
          // onHeightChange={(height) => setFirstDialogHeight(height)}
          footer={
            <>
              <Button variant="secondary" onClick={() => createActivityInstance()}>
                Add
              </Button>
            </>
          }
        >
          <Flex
            fillWidth
            alignItems='center'
            justifyContent='center'
          >
            <Flex
              maxWidth={20}
              alignItems='center'
            >
              <MediaUpload
                emptyState={<Row paddingBottom="80">Drag and drop or click to browse</Row>}
                onFileUpload={handleUploadData}
                initialPreviewImage={editedImageUrl ?? ""}
              >  
              </MediaUpload>
            </Flex>
          </Flex>
          <Column paddingTop="24" fillWidth gap="24">
            {/* <Input
              radius="top"
              label="Name"
              // labelAsPlaceholder
              defaultValue={selectedActivity?.name ?? ""}
              id="name"
              // onChange={(e) => console.log(e.target.value)}
              onChange={(e) => setActivityDisplayName(e.target.value)}
            /> */}
            <Input
              radius="top"
              label="Name"
              // labelAsPlaceholder
              defaultValue={selectedActivity?.activityName ?? ""}
              id="name"
              // onChange={(e) => console.log(e.target.value)}
              onChange={(e) => setActivityDisplayName(e.target.value)}
            />
            <Select
              searchable
              id="location"
              label={selectedLocationValueLabel}
              minHeight={300}
              options={[
                ...locationData.map((location) => ({
                  value: location.id,
                  label: location.name,
                  description: location.address,
                })),
                { value: "create-new", label: "Create New", description: "Add a new location" },
              ]}
              onSelect={(value) => {
                if (value === "create-new") {
                  // Handle the "create new" action here
                  // console.log("Create new location");
                  handleCreateNewLocation();
                  // You can open a modal or navigate to a different page to create a new location
                } else {
                  handleSelectLocation(locationData.find((location) => location.id === value) ?? locationData[0]);
                }
              }}
              value={selectedLocationValue}
            />
            <Input
              radius="top"
              label="Cost"
              // labelAsPlaceholder
              // defaultValue={selectedActivity?.cost?.toString()}
              id="cost"
              // onChange={(e) => console.log(e.target.value)}
              onChange={(e) => setActivityCost(parseInt(e.target.value))}
            />
            <Input
              radius="top"
              label="Rating"
              // labelAsPlaceholder
              // defaultValue={selectedActivity?.rating?.toString()}
              id="rating"
              // onChange={(e) => console.log(e.target.value)}
              onChange={(e) => setActivityRating(parseInt(e.target.value))}
            />
            {/* {selectedActivity && selectedActivity.notes && selectedActivity.notes.map((note) => (
              <Textarea
                key={`${selectedActivity.id} - ${note}`}
                id="notes"
                label="Notes"
                defaultValue={note?.toString() ?? ""}
                lines={2}
                // onChange={(e) => console.log(e.target.value)}
                // append to notes array
                onChange={(e) => setActivityNotes([e.target.value])}
              >
              </Textarea>
            ))} */}
          </Column>
        </Dialog>
        <Dialog
          isOpen={isCreateNewLocationDialogOpen}
          onClose={() => setIsCreateNewLocationDialogOpen(false)}
          title="Create New Location"
          description=""
          style={{marginBottom: "50%"}}
          // onHeightChange={(height) => setFirstDialogHeight(height)}
          footer={
            <>
              <Button variant="secondary" onClick={() => createNewLocation()}>
                CREATE
              </Button>
            </>
          }
            >
            <Input
              id="location"
              label="Location Name"
              value={newLocationName}
              onChange={(value) => setNewLocationName(value.target.value)}
            />
            <Input
              id="address"
              label="Location Address"
              value={newLocationAddress}
              onChange={(value) => setNewLocationAddress(value.target.value)}
            />
          </Dialog>
    </Row>
  )
}