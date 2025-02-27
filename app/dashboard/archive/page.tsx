"use client";

// Archive page that will attempt to be an improved refactoring of the current gallery page
// Page.tsx will still be a server component JK IT WONT
// Robdaylogs will be paginated
// The client will need to be able to navigate to the next (or previous) page of robdaylogs
// The client will need to be able to jump to a specific date or robdaylog number
// The client will need to be able to filter robdaylogs by date, weather, temperature, and activities
// The client will need to be able to filter robdaylogs by location
// The client will need to be able to filter robdaylogs by activity rating
// The client will need to be able to add or edit robdaylog ratings and notes
// The client will need to be able to add or edit robdaylog activity instance ratings, cost, images, and notes

import { useEffect, useState } from "react";
import { Column, Row, Heading, Background, Dialog, Button, Flex, Input, Textarea, Switch, TagInput, Select, Skeleton, IconButton } from "@/once-ui/components";
import RobdayLog from "@/app/ui/dashboard/robday-log";
import RobDayLogCard from "@/app/ui/dashboard/gallery/robday-log-card";
import RobdayLogSelector from "@/app/ui/dashboard/gallery/robdaylog-selector";

import outputs from "@/amplify_outputs.json"
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { data, type Schema } from "@/amplify/data/resource";
import { getUrl } from 'aws-amplify/storage';
import { convertToPastTense2, getHistoricalWeather } from "@/app/lib/utils";
// import { 
//     RobDayLogActivityProps, 
//     LocationData, 
//     // RobDayLogBaseActivityProps, 
//     RobdayLogProps 
// } from "@/app/lib/definitions";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function Page() {
	const [selectedRobdayLog, setSelectedRobdayLog] = useState("48a09c0b-112b-4d1b-8ce5-e0e01890f65a");
	const [selectedRobdayLogNumber, setSelectedRobdayLogNumber] = useState(7);
	// const [robdayLogs, setRobdayLogs] = useState<RobdayLogProps[]>([]);
	const [robdayLogs, setRobdayLogs] = useState<Array<Schema["Robdaylog"]["type"]>>([]);
	const [addRobdayLogDialogOpen, setAddRobdayLogDialogOpen] = useState(false);
	const [activities, setActivities] = useState<Array<Schema["Activity"]["type"]>>([]);
	const [selectedActivities, setSelectedActivities] = useState<Array<Schema["Activity"]["type"]>>([]);
	const [newActivityInstanceIds, setNewActivityInstanceIds] = useState([""]);
	const [newRobdayLogNumber, setNewRobdayLogNumber] = useState(0);
	const [newRobdayLogDate, setNewRobdayLogDate] = useState("");
	const [newRobdayLogWeather, setNewRobdayLogWeather] = useState("");
	const [newRobdayLogTemperature, setNewRobdayLogTemperature] = useState(0);
	const [newRobdayLogNotes, setNewRobdayLogNotes] = useState("");
	const [addedActivityId, setAddedActivityId] = useState<string>("");
	const [addedActivityName, setAddedActivityName] = useState<string>("");

	// const [newRobdayLogNumber, setNewRobdayLogNumber] = useState(0);


	function onChangeRobdayLog(robdayNumber: number) {
		console.log("Selected Robday Number:", robdayNumber);
		const id = robdayLogs.find((log) => log.robDayNumber === robdayNumber)?.id;
		if (id) {
			setSelectedRobdayLog(id);
		}
		setSelectedRobdayLog(id ?? "");
		console.log("Selected Robday Log:", id);
	}

	function listRobdayLogs() {
		client.models.Robdaylog.observeQuery().subscribe({
			next: async (data) => {
				setRobdayLogs([...data.items]);
			},
			error: (error) => {
				console.error("Error fetching robday logs", error);
			}
		});
		if (robdayLogs.length === 0) {
			return
		}
		setSelectedRobdayLog(robdayLogs[robdayLogs.length - 1].id ?? "48a09c0b-112b-4d1b-8ce5-e0e01890f65a");
		setSelectedRobdayLogNumber(robdayLogs[robdayLogs.length - 1].robDayNumber ?? 33);
	}
	function listActivities() {
		client.models.Activity.observeQuery().subscribe({
			next: async (data) => {
				setActivities([...data.items]);
			},
			error: (error) => {
				console.error("Error fetching activities", error);
			}
		});
	}

	async function handleSelectActivity(activity: Schema["Activity"]["type"], date: string) {
		console.log("Selected Activity:", activity);
		setAddedActivityId(activity.id);
		setAddedActivityName(activity.name?? "");
		// Create a new activity instance
		// const newActivityInstance = {
		// 	activityId: activity.id,
		// 	displayName: activity.name,
		// 	locationId: "pending",
		// 	robdaylogId: "pending",
		// 	date: date,
		// 	status: "Completed" as "Completed",
		// 	activity: activity,
		// 	rating: 0,
		// 	cost: 0,
		// 	images: [],
		// 	notes: [],
		// }
		// const result = client.models.ActivityInstance.create({...newActivityInstance});
		// console.log(result)
	}

	function addActivityToSelectedRobdayLog() {
		console.log("Adding Activity to Robday Log", addedActivityId);
		const displayName = convertToPastTense2(`We ${addedActivityName}`.toLowerCase());
		console.log("Activity Display Name:", displayName);
		const result = client.models.RobdaylogActivity.create({
			activityId: addedActivityId,
			robdaylogId: selectedRobdayLog,
		}).then((data) => {
			console.log("Activity added to Robday Log", data);
		}
		).catch((error) => {
			console.error("Error adding activity to Robday Log", error);
		});
		const activityInstanceProps = {
			activityId: addedActivityId,
			displayName: displayName.split("we ")[1],
			locationId: "pending",
			robdaylogId: selectedRobdayLog,
			date: robdayLogs.find((log) => log.id === selectedRobdayLog)?.date ?? new Date().toISOString().split("T")[0],
			status: "Completed" as "Completed",
			rating: 0,
			cost: 0,
			images: [],
			notes: [],
		}

		client.models.ActivityInstance.create({...activityInstanceProps}).then((data) => {
			console.log("Activity instance created successfully", data);
		}).catch((error) => {
			console.error("Error creating activity instance", error);
		});
		setAddedActivityId("");
		setAddedActivityName("");
	}


	function handleAddRobdayLog() {
		console.log("Creating Robday Log");
		const activityIds = activities.map((activity) => activity.id);
		const newRobdayLog = {
			robDayNumber: newRobdayLogNumber,
			date: newRobdayLogDate ? new Date(newRobdayLogDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
			weatherCondition: newRobdayLogWeather,
			temperature: newRobdayLogTemperature,
			notes: [newRobdayLogNotes],
			activityInstances: newActivityInstanceIds,
			activities: activityIds,
			status: "Completed" as "Completed",
		}
		client.models.Robdaylog.create({
			...newRobdayLog
		}).then((data) => {
			console.log("Robday Log created successfully", data);
			setAddRobdayLogDialogOpen(false);
			listRobdayLogs();
			setNewActivityInstanceIds([""]);
			setNewRobdayLogNumber(0);
			setNewRobdayLogDate("");
			setNewRobdayLogWeather("");
			setNewRobdayLogTemperature(0);
			setNewRobdayLogNotes("");
			setSelectedActivities([]);
			setSelectedRobdayLog(data.data?.id ?? "");
		}).catch((error) => {
			console.error("Error creating Robday Log", error);
		});
	}

	const onGetHistoricalWeather = async (date: string, location: string) => {
		try {
			const data = await getHistoricalWeather(date, location);
			console.log("Historical Weather Data:", data);
			if (data) {
				setNewRobdayLogTemperature(Math.round(data.temperature * 9/5 + 32));
				setNewRobdayLogWeather(data.conditions);
			}
		} catch (error) {
			console.error("Error fetching historical weather:", error);
		}
	};

	useEffect(() => {
		listRobdayLogs();
		listActivities();
	}, []);

	return (
		<Column as="main" fillWidth paddingY="40" paddingX="s" alignItems="center" flex={1}>
			<Column
				overflow="hidden"
				// as="main"
				maxWidth="l"
				position="relative"
				// radius="xl"
				alignItems="center"
				// border="neutral-alpha-weak"
				gap="48"
				fillWidth
			>
				<Column
					fillWidth
					alignItems="center"
					gap="48"
					radius="xl"
					paddingTop="80"
					// paddingBottom="80"
					marginBottom="l"
					position="relative"
					background="surface"
				>
					<Background
						mask={{
							x: 0,
							y: 0,
							radius: 200,
						}}
						position="absolute"
						gradient={{
							display: true,
							tilt: 0,
							opacity: 50,
							height: 30,
							width: 275,
							x: 100,
							y: 40,
							colorStart: "accent-solid-strong",
							colorEnd: "static-transparent",
						}}
					/>
					<Background
						mask={{
							x: 100,
							y: 0,
							radius: 50,
							cursor: true
						}}
						position="absolute"
						gradient={{
							display: true,
							opacity: 80,
							tilt: -90,
							height: 220,
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
			<Column fillWidth alignItems="center" gap="48" marginBottom="l">
				<RobdayLogSelector selectedRobdayLogNumber={selectedRobdayLogNumber} numberOfRobdays={robdayLogs.length} setSelectedRobdayLogId={onChangeRobdayLog} />
				{(selectedRobdayLog !== "") ? <RobDayLogCard images={[]} robdayLogId={selectedRobdayLog}/> : <Skeleton shape="block" />}
				<Button onClick={() => setAddRobdayLogDialogOpen(true)} weight="default">
					Create Missing Robday Log
				</Button>
			</Column>
			<Column fillWidth fillHeight >
			<Dialog
				isOpen={addRobdayLogDialogOpen}
				onClose={() => setAddRobdayLogDialogOpen(false)}
				title="Add Robday Log"
				footer={
					<>
					<Button variant="secondary" onClick={() => setAddRobdayLogDialogOpen(false)}>
						Cancel
					</Button>
					<Button onClick={handleAddRobdayLog}>
						Create Robday Log
					</Button>
					</>
				}
			>
				<Column gap="16">
					<Input id="robday-number" label="Robday Number" type="number" onChange={(value) => setNewRobdayLogNumber(parseInt(value.target.value))} />
					<Input id="date" label="Date" type="date" onChange={(value) => setNewRobdayLogDate(value.target.value)} />
					{/* <Select id="activities" label="Activities" searchable
						options={activities.map((activity) => ({ label: activity.name, value: activity.id }))}
						onSelect={(e) => handleSelectActivity(activities.find((activity) => activity.id === e) ?? activities[0], "")}
					/> */}
					<Row fillWidth>
					<Input defaultValue={newRobdayLogWeather} id="weather" label="Weather" onChange={(value) => setNewRobdayLogWeather(value.target.value)} />
					<Button weight="default" onClick={() => onGetHistoricalWeather(new Date(newRobdayLogDate).toISOString().split("T")[0], "Washington,DC")}>
						Get Weather
					</Button>
					</Row>
					<Input defaultValue={newRobdayLogTemperature} id="temperature" label="Temperature" type="number" onChange={(value) => setNewRobdayLogTemperature(parseInt(value.target.value))} />
					<Textarea id="notes" label="Notes" onChange={(value) => setNewRobdayLogNotes(value.target.value)} />
					
				</Column>
			</Dialog>
			<Select id="activities" label="Activities" value={addedActivityName}
						options={activities.map((activity) => ({ label: activity.name, value: activity.id }))}
						onSelect={(e) => handleSelectActivity(activities.find((activity) => activity.id === e) ?? activities[0], "")}
						searchable={true}
					/>
			<Button onClick={addActivityToSelectedRobdayLog} weight="default">
				Add Activity to Robday Log
			</Button>
			</Column>
		</Column>
	);
}