"use client";


import CardWrapper from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import Image from "next/image";
// import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { roboto } from '@/app/ui/fonts';
import { useEffect, useState, useMemo } from 'react';
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from '@/app/ui/skeletons';
import {
  Column,
  Heading,
  Row,
  Text
} from "@/once-ui/components";
import { Sidebar } from "@/once-ui/modules";
import styles from '@/app/dashboard/(overview)/styles.module.css';
import robday from '@/public/robday.jpeg';
import robdaycropblur from '@/public/robdaycropblur.jpeg';
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

const GridExample = () => {
  // Row Data: The data to be displayed.
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

  function populateActivities() {
    client.models.Activity.observeQuery().subscribe({
      next: async (data) => {
        setActivities([...data.items]);
        setRowData(data.items.map((activity) => ({
          name: activity.name,
          count: activity.count,
          rating: activity.rating,
          cost: activity.cost,
          level_of_effort: activity.lever_of_effort,
          location: activity.location,
          categories: activity.categories ? activity.categories.filter((category): category is string => category !== null) : null,
        })));
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


export default function Page() {
  return (
    <main>
      {/* <Sidebar /> */}
      <div className={`${styles.bgWrap} hidden md:block`}>
        <Image
          alt="Mountains"
          src={robdaycropblur}
          quality={100}
          placeholder="blur"
          fill={false}
          sizes="100vh"
          // zIndex={10}
          style={{
            objectFit: "contain",
          }}
        />
      </div>
      <Column fillWidth alignItems="center" gap="32" padding="32" position="relative">
        <Heading wrap="balance" variant="display-default-l" align="center" marginBottom="16">
          DASHBOARD
        </Heading>
        {/* <Text>
         HERE'S WHERE ALL THE STATS WILL BE!
        </Text> */}
        <GridExample />
      </Column>
      {/* <h1 className={`${roboto.className} text-white mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1> */}
      {/* <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className={`${roboto.className} mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8`}>
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoicesSkeleton />
        </Suspense>
      </div> */}
    </main>
  );
}