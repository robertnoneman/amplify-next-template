"use client";

import { useState, useEffect, SetStateAction } from "react";
import {
    Column,
    Row,
    Text,
    Button,
    Select,
    IconButton
} from "@/once-ui/components";



export default function RobdayLogSelector(
    {
        selectedRobdayLogNumber,
        setSelectedRobdayLogId
    }: {
        selectedRobdayLogNumber: number | null;
        setSelectedRobdayLogId: (robdayNumber: number) => void;
    }
) {
    const [selectedLog, setSelectedLog] = useState<string | null>(null);
    const [robdayNumber, setRobdayNumber] = useState<number>(33);
    const [numberOfRobdays, setNumberOfRobdays] = useState<number>(33);

    // useEffect(() => {

    // }, []);

    const handleLogSelection = (log: string) => {
        setSelectedLog(log);
        console.log("Selected Robday Log:", log);
        const logNumber = parseInt(log.split("#")[1]);
        console.log("Selected Robday Number:", logNumber);
        setSelectedRobdayLogId(logNumber);
        setRobdayNumber(logNumber);
        // setSelectedRobdayLogId(log);
    };
    const incrementRobdayNumber = () => {
        if (robdayNumber === numberOfRobdays) {
            return;
        }
        setRobdayNumber(robdayNumber + 1);
        setSelectedRobdayLogId(robdayNumber + 1);
        setSelectedLog(`Robday #${robdayNumber + 1}`);
    }
    const decrementRobdayNumber = () => {
        if (robdayNumber === 1) {
            return;
        }
        setRobdayNumber(robdayNumber - 1);
        setSelectedRobdayLogId(robdayNumber - 1);
        setSelectedLog(`Robday #${robdayNumber - 1}`);
    }   

    return (
        <Column justifyContent="center" alignItems="center">
        <Row fillWidth gap="16" justifyContent="center" align="center" alignItems="center">
            <IconButton variant="secondary" icon="chevronLeft" onClick={decrementRobdayNumber}/>
            <Select
                id="log-selector"
                label={selectedLog ?? 'Select Robday'}
                value={`Robday #${robdayNumber}`}
                onSelect={(e) => handleLogSelection(e)}
                options={Array.from({ length: numberOfRobdays }, (_, i) => ({
                    label: `Robday ${i + 1}`,
                    value: `Robday #${i + 1}`
                }))}
            />
            <IconButton variant="secondary" icon="chevronRight" onClick={incrementRobdayNumber}/>
        </Row>
        </Column>
    )
}