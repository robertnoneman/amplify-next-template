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
import { Column, Row, Heading, Background, Dialog, Button, Flex, Input, Textarea, Switch, TagInput, Select, Skeleton } from "@/once-ui/components";
import RobdayLog from "@/app/ui/dashboard/robday-log";
import RobDayLogCard from "@/app/ui/dashboard/gallery/robday-log-card";
import RobdayLogSelector from "@/app/ui/dashboard/gallery/robdaylog-selector";

import outputs from "@/amplify_outputs.json"
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { data, type Schema } from "@/amplify/data/resource";
import { getUrl } from 'aws-amplify/storage';
// import { 
//     RobDayLogActivityProps, 
//     LocationData, 
//     // RobDayLogBaseActivityProps, 
//     RobdayLogProps 
// } from "@/app/lib/definitions";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function Page() {
	const [selectedRobdayLog, setSelectedRobdayLog] = useState("49154454-449f-4b4b-abf7-d214f26ddce5");
	const [selectedRobdayLogNumber, setSelectedRobdayLogNumber] = useState(33);
	// const [robdayLogs, setRobdayLogs] = useState<RobdayLogProps[]>([]);
	const [robdayLogs, setRobdayLogs] = useState<Array<Schema["Robdaylog"]["type"]>>([]);

	function onChangeRobdayLog(robdayNumber: number) {
		console.log("Selected Robday Number:", robdayNumber);
		const id = robdayLogs.find((log) => log.robDayNumber === robdayNumber)?.id;
		if (id) {
			setSelectedRobdayLog(id);
		}
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
		setSelectedRobdayLog(robdayLogs[-1].id ?? "49154454-449f-4b4b-abf7-d214f26ddce5");
		setSelectedRobdayLogNumber(robdayLogs[-1].robDayNumber ?? 33);
	}

	useEffect(() => {
		listRobdayLogs();
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
				<RobDayLogCard images={[]} robdayLogId={selectedRobdayLog}/>
			</Column>
		</Column>
	);
}