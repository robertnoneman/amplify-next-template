"use client";

import { useState } from 'react';

import {
  Background,
  Heading,
  Fade,
  Logo,
  Button,
  StyleOverlay,
  IconButton,
  Icon,
  Row,
  Text,
  Input,
  Column,
  Flex,
  SmartImage,
  Switch,
  Dialog,
  Textarea,
  TagInput,
  TiltFx,
  Chip,
  Tag,
  RevealFx,
  Line,
  Grid,
  Select,
  Accordion
} from "@/once-ui/components";
import { roboto } from '@/app/ui/fonts';
import { RobDayLogActivityProps, LocationData } from "@/app/lib/definitions";
import { 
  updateActivityInstance, 
  resetActivityInstance,
  removeActivityInstance,
  completeActivityInstance,
  createLocation
} from "@/app/lib/actions";


export default function ActivityInstanceItem(activityInstanceProps: RobDayLogActivityProps, locationData: LocationData[]) {
  const updateActivityInstanceWithId = updateActivityInstance.bind(null, activityInstanceProps.activityInstanceId);
  const resetActivityTime = resetActivityInstance.bind(null, activityInstanceProps.activityInstanceId);
  const removeActivityInstanceWithId = removeActivityInstance.bind(null, activityInstanceProps.activityInstanceId);
  const completeActivityInstanceWithId = completeActivityInstance.bind(null, activityInstanceProps.activityInstanceId);
  const createNewLocationWithId = createLocation.bind(null, locationData[0].id);
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false);
  const [isCreateNewLocationDialogOpen, setIsCreateNewLocationDialogOpen] = useState(false);
  const [selectedLocationValue, setSelectedLocationValue] = useState("");
  const [selectedLocationValueLabel, setSelectedLocationValueLabel] = useState("Choose a location");
  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationAddress, setNewLocationAddress] = useState("");
  // const [content, setContent] = useState(activityInstanceProps.activityInstanceDisplayName);
  const [location, setLocation] = useState(activityInstanceProps.locationData);
  const [status, setStatus] = useState(activityInstanceProps.status);

  const updateActivityInstanceLocation = () => {
    const updatedActivityInstanceProps = { ...activityInstanceProps, locationData: location };
    // activityInstanceProps.content = content;
    updateActivityInstanceWithId(updatedActivityInstanceProps);
  }

  const updateActivityInstanceStatus = (newStatus: string) => {
    const updatedActivityInstanceProps = { ...activityInstanceProps, status: newStatus as "Planned" | "InProgress" | "Paused" | "Completed" };
    setStatus(newStatus as "Planned" | "InProgress" | "Paused" | "Completed");
    // activityInstanceProps.content = content;
    updateActivityInstanceWithId(updatedActivityInstanceProps);
  }

  const resetActivityInstanceTime = () => {
    updateActivityInstanceStatus("Planned");
    setStatus("Planned");
    resetActivityTime(activityInstanceProps);
  }

  const onRemoveActivityInstance = () => {
    removeActivityInstanceWithId();
  }

  const onCompleteActivityInstance = (activityInstance: RobDayLogActivityProps) => {
    completeActivityInstanceWithId(activityInstance);
  }

  const onEditActivityInstance = () => {
    setIsSecondDialogOpen(true);
  }

  const handleSelectLocation = (location: LocationData) => {
    setSelectedLocationValue(location.id);
    setSelectedLocationValueLabel(location.name);
    setLocation(location);
  }

  function handleCreateNewLocation() {
    setSelectedLocationValue("");
    setSelectedLocationValueLabel("Choose a location");
    setIsCreateNewLocationDialogOpen(true);
  }

  function createNewLocation() {
    const locData = {
      name: newLocationName,
      address: newLocationAddress,
      id: ""
    };
    createNewLocationWithId(locData);
    setIsCreateNewLocationDialogOpen(false);
  }

  return (
    <Column key={`${activityInstanceProps.activityInstanceId}`} fillWidth>
      <Row
        fillWidth
        padding="xs"
        gap="m"
        position="relative"
        // height="xs"
        mobileDirection="column"
        overflow="hidden"
        radius={undefined}
      // key={`${activityInstance.id}`}
      // bottomRadius="l"
      // topRadius='l'
      // alignItems="md:center"
      // overflow="scroll"
      // border="brand-medium"
      // background="page"
      // radius="l"
      >
        <Row fillWidth justifyContent="space-between">
          <Row
            border="brand-alpha-weak"
            position="relative"
            maxWidth={10}
            // aspectRatio={0.75}
            overflow="hidden"
          >
            <SmartImage
              // fitWidth
              src={activityInstanceProps.imageUrls[0] ?? "https://static-00.iconduck.com/assets.00/loading-icon-1024x1024-z5lrc2lo.png"}
              alt="Robday"
              aspectRatio="16/9"
              objectFit="cover"
              sizes="xs"
              radius="xl"
            // maxHeight={15}
            />
          </Row>
          <Column>
            {activityInstanceProps.status === "Planned" && (
              <Row justifyContent="flex-end" fillHeight alignItems="center">
                <IconButton
                  icon="play"
                  onClick={() => updateActivityInstanceStatus("InProgress")}
                  variant="tertiary"
                  size="s"
                />
              </Row>
            )}
            {activityInstanceProps.status === "InProgress" && (
              <Row justifyContent="flex-end" fillHeight alignItems="center" >
                <IconButton
                  icon="stop"
                  onClick={() => updateActivityInstanceStatus("Completed")}
                  variant="tertiary"
                  size="s"
                />
              </Row>
            )}
            {activityInstanceProps.status === "Completed" && (
              <Row justifyContent="flex-end" fillHeight alignItems="center">
                <IconButton
                  icon="rewind"
                  onClick={() => resetActivityInstanceTime()}
                  variant="tertiary"
                  size="l"
                />
              </Row>
            )}
          </Column>
        </Row>
        <Column fillWidth fillHeight>
          <Text
            padding="xs" align="left" onBackground="neutral-strong" variant="display-default-xs"
          >
            {activityInstanceProps.activityInstanceDisplayName?.toUpperCase() ?? "ACTIVITY TBD"}
          </Text>
          <Text
            paddingLeft="xs" align="left" onBackground="neutral-medium" variant="code-default-xs"
          >
            {/* {activityInstance.location?.name?.toUpperCase() ?? "LOCATION TBD"} */}
            {locationData.find((location) => location.id === activityInstanceProps.locationData.id)?.name?.toUpperCase() ?? "LOCATION TBD"}
          </Text>
          <Line />
          {activityInstanceProps.activityInstanceNotes?.map((note) => (
            <Text key={note} padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s">
              {note}
            </Text>
          ))}
        </Column>
        <Column justifyContent="space-evenly" mobileDirection="row" background="neutral-alpha-weak" border="neutral-alpha-medium" radius="s">
          <IconButton
            icon="close"
            onClick={() => onRemoveActivityInstance()}
            variant="tertiary"
            size="s"
          />
          <IconButton
            icon="edit"
            onClick={() => onEditActivityInstance()}
            variant="tertiary"
            size="s"
          />
          <IconButton
            icon="check"
            onClick={() => onCompleteActivityInstance(activityInstanceProps)}
            variant="tertiary"
            size="s"
          />
        </Column>
        {/* </Background> */}
      </Row>
      <Line height={0.1} />
      <Dialog
        isOpen={isSecondDialogOpen}
        onClose={() => setIsSecondDialogOpen(false)}
        title="Edit Robday Activity"
        description=""
        // onHeightChange={(height) => setFirstDialogHeight(height)}
        footer={
          <>
            <Button variant="secondary" onClick={() => updateActivityInstanceLocation()}>
              UPDATE
            </Button>
          </>
        }
          >
          <Text variant="body-default-s">
            Ability to edit activity here coming soon...
          </Text>
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
    </Column>
  )
}