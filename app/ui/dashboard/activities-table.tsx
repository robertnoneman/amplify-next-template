"use client";


import { useEffect, useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { 
  ColDef, 
  themeQuartz, 
  colorSchemeDark, 
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy, 
} from "ag-grid-community";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import {
    Column,
    Heading,
    Row,
    Text
  } from "@/once-ui/components";


Amplify.configure(outputs);

const client = generateClient<Schema>();

ModuleRegistry.registerModules([AllCommunityModule]);

// Row Data Interface
interface IRow {
  name: string | null;
  count: number | null;
  rating: number | null;
  cost: number | null;
  level_of_effort: number | null;
  location: string | null;
  categories: string[] | null;
}


export default function ActivitiesTable() {
    const [activities, setActivities] = useState<Array<Schema["Activity"]["type"]>>([]);
  // const [rowData, setRowData] = useState([
  //     { name: "Disc Golf", count: 3, rating: 8.5, cost: 0 },
  //     { name: "Go to a Movie", count: 1, rating: 7.0, cost: 10 },
  //     { name: "Darts", count: 5, rating: 9.5, cost: 20 },
  // ]);
  const [rowData, setRowData] = useState<IRow[]>([]);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState<ColDef<IRow>[]>([
    { headerName: "Activity", field: "name" },
    { field: "count" },
    { field: "rating" },
    { field: "cost",
      valueFormatter: params => { return '$' + params.value.toLocaleString(); }
     },
    { headerName: "Level of Effort", field: "level_of_effort" },
    { field: "location" },
    { field: "categories" },
  ]);

  const defaultColDef: ColDef = {
    flex: 1,
  };

  const autoSizeStrategy = useMemo<
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy
  >(() => {
    return {
      type: "fitCellContents",
    };
  }, []);

  const myTheme = themeQuartz.withPart(colorSchemeDark);

  async function populateActivities() {
    client.models.Activity.observeQuery().subscribe({
      next: async (data) => {
        setActivities([...data.items]);
        const rows = await Promise.all(data.items.map(async (activity) => ({
          name: activity.name,
          count:  (await activity.activityInstances()).data.length,
          rating: activity.rating,
          cost: activity.cost,
          level_of_effort: activity.lever_of_effort,
          location: activity.location,
          categories: activity.categories ? activity.categories.filter((category): category is string => category !== null) : null,
        })));
        setRowData(rows);
      }
    });
  };

  useEffect(() => {
    populateActivities();
  }, []);

  // Container: Defines the grid's theme & dimensions.
  return (
    <Row fillWidth height="xl">
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        containerStyle={{ height: "100%", width: "100%" }}
        theme={myTheme}
        autoSizeStrategy={autoSizeStrategy}
      />
    </Row>
  );
};
