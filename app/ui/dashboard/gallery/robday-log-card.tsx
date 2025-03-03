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
  Button,
  Grid,
  Dialog,
  Input,
  Textarea, 
  Select
} from "@/once-ui/components";
import { Gallery } from 'next-gallery';
import { RobdayLogProps, RobDayLogActivityProps, LocationData } from "@/app/lib/definitions";
import { formatDate } from "@/app/lib/utils";
import { SetStateAction, useEffect, useState } from "react";

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
    // TODO: location data??
    robdayLogId,
  }: {
    images: { src: string, aspect_ratio: number }[];
    robdayLogId: string;
  }
) {
  const [robdayLogData, setRobdayLogData] = useState<RobdayLogProps | null>(null);
  // const [locationData, setLocationData] = useState<Schema["Location"]["type"] | null>(null);
  const [locations, setLocations] = useState<Array<Schema["Location"]["type"]>>([]);
  const [selectedLocation, setSelectedLocation] = useState<Schema["Location"]["type"] | null>(null);
  const [isCreateNewLocationDialogOpen, setIsCreateNewLocationDialogOpen] = useState(false);
  const [selectedLocationValue, setSelectedLocationValue] = useState("");
  const [selectedLocationValueLabel, setSelectedLocationValueLabel] = useState("Choose a location");
  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationAddress, setNewLocationAddress] = useState("");
  const [activityInstances, setActivityInstances] = useState<Schema["ActivityInstance"]["type"][]>([]);
  const [activityDisplayName, setActivityDisplayName] = useState<string>("");
  const [activityInstanceProps, setActivityInstanceProps] = useState<RobDayLogActivityProps[]>([]);
  const [activityImages, setActivityImages] = useState<{ src: string, aspect_ratio: number }[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [cost, setCost] = useState<number | null>(null);
  const [notes, setNotes] = useState<string[]>([]);
  const [editedActivityInstanceId, setEditedActivityInstanceId] = useState<string>("");
  const [newRobdayLogNumber, setNewRobdayLogNumber] = useState<number>(0);
  const [newRobdayLogWeather, setNewRobdayLogWeather] = useState<string>("");
  const [newRobdayLogTemperature, setNewRobdayLogTemperature] = useState<number>(0);

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

  function listLocations() {
    client.models.Location.observeQuery().subscribe({
      next: async (data) => {
        setLocations([...data.items]);
      },
    })
  }

  const handleSelectLocation = (location: Schema["Location"]["type"]) => {
      console.log("Selected option:", location.name);
      setSelectedLocation(location);
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

  const editActivityInstance = async (activityInstanceId: string, displayName: string, rating: number, cost: number, notes: string[]) => {
    setRating(rating);
    setCost(cost);
    setNotes(notes);
    setActivityDisplayName(displayName);
    console.log("Activity Instance ID:", activityInstanceId);
    console.log("displayName:", displayName);
    console.log("Rating:", rating);
    // Cast rating to integer
    rating = Math.round(rating);
    const result = await client.models.ActivityInstance.update({ id: editedActivityInstanceId, rating: rating, cost: cost, notes: notes, displayName: displayName, locationId: selectedLocation?.id });
    console.log(result);
    setEditedActivityInstanceId("");
    setRating(null);
    setIsDialogOpen(false);
    setSelectedLocationValue("");
    setSelectedLocationValueLabel("Choose a location");
    fetchRobdayLogData();
  }

  const onEditActivityRating = async (activityInstanceId: string, displayName: string, locationId: string, rating: number, cost: number, notes: string[]) => {
    console.log("Activity Instance ID:", activityInstanceId);
    console.log("Rating:", rating);
    setRating(rating);
    setCost(cost);
    setActivityDisplayName(displayName);
    setNotes(notes);
    setEditedActivityInstanceId(activityInstanceId);
    const tempSelectedLocation = locations.find((location) => location.id === locationId) ?? locations[0];
    setSelectedLocation(tempSelectedLocation);
    setSelectedLocationValue(tempSelectedLocation.name ?? "Location");
    setSelectedLocationValueLabel(tempSelectedLocation.name ?? "Choose a location");
    setIsDialogOpen(true);
  }

  const editActivityCost = async (activityInstanceId: string, cost: number) => {
    console.log("Activity Instance ID:", activityInstanceId);
    console.log("Cost:", cost);
    // const result = await client.models.ActivityInstance.update({ id: activityInstanceId, cost: cost });
    // console.log(result);
    fetchRobdayLogData();
  }

  const editActivityNotes = async (activityInstanceId: string, notes: string[]) => {
    console.log("Activity Instance ID:", activityInstanceId);
    console.log("Notes:", notes);
    // const result = await client.models.ActivityInstance.update({ id: activityInstanceId, notes: notes });
    // console.log(result);
    fetchRobdayLogData();
  }

  const handleEditRobdayLog = async () => {
    let editedRobdayLogNumber = newRobdayLogNumber;
    if (editedRobdayLogNumber === 0) {
      editedRobdayLogNumber = robdayLogData?.robdayLogNumber ?? 0;
    }
    let editedRobdayLogWeather = newRobdayLogWeather;
    if (editedRobdayLogWeather === "") {
      editedRobdayLogWeather = robdayLogData?.robdayLogWeather ?? "";
    }
    let editedRobdayLogTemperature = newRobdayLogTemperature;
    if (editedRobdayLogTemperature === 0) {
      editedRobdayLogTemperature = robdayLogData?.robdayLogTemperature ?? 0;
    }
    let newNotes = notes;
    if (newNotes.length === 0) {
      newNotes = robdayLogData?.notes ?? [];
    }
    const result = await client.models.Robdaylog.update({
      id: robdayLogId,
      robDayNumber: editedRobdayLogNumber,
      weatherCondition: editedRobdayLogWeather,
      temperature: editedRobdayLogTemperature,
      notes: newNotes
    });
    console.log(result);
    setNotes([]);
    setNewRobdayLogNumber(0);
    setNewRobdayLogWeather("");
    setNewRobdayLogTemperature(0);
    fetchRobdayLogData();
    setIsEditDialogOpen(false);
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
    listLocations();
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
      onDoubleClick={() => setIsEditDialogOpen(true)}
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
      <Text variant="body-default-l">{formatDate(robdayLogData?.robdayLogDate ?? '')}</Text>
      {/* <Line width={15} height={0.1} background="neutral-alpha-medium" /> */}
      <Row fillWidth alignItems="center" gap="8">
      <Text variant="body-default-m">Weather: </Text>
      <Text variant="body-default-xs">{robdayLogData?.robdayLogWeather} - {robdayLogData?.robdayLogTemperature}°</Text>
      </Row>
      <Row fillWidth alignItems="center" gap="8">
      <Text variant="body-default-m">Notes: </Text>
      <Text variant="body-default-xs">{robdayLogData?.notes.join(', ')}</Text>
      </Row>
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
              {activityInstance.locationData?.name?.toUpperCase() ?? "LOCATION TBD"}
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
                <Row gap="4" 
                // onClick={() => editActivityRating(activityInstance.activityInstanceId, 5)}
                onClick={() => onEditActivityRating(activityInstance.activityInstanceId, activityInstance.activityInstanceDisplayName, activityInstance.locationData.id, activityInstance.activityInstanceRating, activityInstance.activityInstanceCost, activityInstance.activityInstanceNotes)}
                cursor="interactive"
                zIndex={10}
                >
                  <Column width={6}>
                    <Text padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s" >
                      RATING
                    </Text>
                  </Column>
                  <Line vertical width={0.1} />
                  <Column fillWidth justifyContent="center" >
                    <Text padding="xs" align="left" onBackground="neutral-strong" variant="body-default-s">
                      {activityInstance?.activityInstanceRating}
                    </Text>
                  </Column>
                </Row>
                <Line />
                <Row gap="4"
                onClick={() => onEditActivityRating(activityInstance.activityInstanceId, activityInstance.activityInstanceDisplayName, activityInstance.locationData.id, activityInstance.activityInstanceRating, activityInstance.activityInstanceCost, activityInstance.activityInstanceNotes)}
                cursor="interactive"
                zIndex={10}>
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
                <Row gap="4"
                onClick={() => onEditActivityRating(activityInstance.activityInstanceId, activityInstance.activityInstanceDisplayName, activityInstance.locationData.id, activityInstance.activityInstanceRating, activityInstance.activityInstanceCost, activityInstance.activityInstanceNotes)}
                cursor="interactive"
                zIndex={10}>
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
    <Dialog 
      isOpen={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
      title="Add Rating"
      description="Rate this activity"
      fillHeight
      footer={
        <>
          <Button variant="primary" onClick={() => editActivityInstance(activityInstances[0].id, activityDisplayName?? "", rating ?? 0, cost ?? 0, notes ?? [])}>
            Save
          </Button>
          <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
        </>
      }
    >
      <Input
        id="activity-name"
        label="Activity Display Name"
        defaultValue={activityDisplayName}
        onChange={(e) => setActivityDisplayName(e.target.value)}
      />
      <Select
            searchable
            id="location"
            label={selectedLocation?.name ?? "Location"}
            minHeight={300}
            options={[
              ...locations.map((location) => ({
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
                handleSelectLocation(locations.find((location) => location.id === value) ?? locations[0]);
              }
            }}
            value={selectedLocation?.name ?? ""}
          />
      <Input
        id="rating"
        label="Rating"
        defaultValue={rating?.toString()}
        onChange={(e) => setRating(Number(e.target.value))}
      />
      <Input
      id="cost"
      label="Cost"
      defaultValue={cost?.toString()}
      onChange={(e) => setCost(Number(e.target.value))}
      />
    <Textarea
      id="notes"
      label="Notes"
      defaultValue={notes?.toString()}
      onChange={(e) => setNotes([e.target.value])}
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
    <Dialog
      isOpen={isEditDialogOpen}
      onClose={() => setIsEditDialogOpen(false)}
      title="Edit Robday Log"
      description="Edit Robday Log"
      footer={
        <>
          <Button variant="primary" onClick={() => handleEditRobdayLog()}>
            Save
          </Button>
          <Button variant="secondary" onClick={() => setIsEditDialogOpen(false)}>
            Cancel
          </Button>
        </>
      }
    >
      <Input
        id="robday-number"
        label="Robday Number"
        defaultValue={robdayLogData?.robdayLogNumber.toString()}
        onChange={(e) => setNewRobdayLogNumber(Number(e.target.value))}
      />
      <Input
        id="weather"
        label="Weather"
        defaultValue={robdayLogData?.robdayLogWeather}
        onChange={(e) => setNewRobdayLogWeather(e.target.value)}
      />
      <Input
        id="temperature"
        label="Temperature"
        defaultValue={robdayLogData?.robdayLogTemperature.toString()}
        onChange={(e) => setNewRobdayLogTemperature(Number(e.target.value))}
      />
      <Textarea
        id="notes"
        label="Notes"
        defaultValue={robdayLogData?.notes.join(", ")}
        onChange={(e) => setNotes([e.target.value])}
      />
    </Dialog>
    </Card>
  )
}