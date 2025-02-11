
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
    Scroller
  } from "@/once-ui/components";

import { roboto } from '@/app/ui/fonts';
import TodoList from "@/app/ui/dashboard/todo/todo-list";
import { fetchTodos } from "@/app/lib/actions";
import { unstable_cache } from 'next/cache';
import Image from 'next/image';
import fs from 'fs/promises';
import path from 'path';
import { S3Client, ListObjectsV2Command, ListObjectsV2CommandInput } from '@aws-sdk/client-s3';
import { list } from 'aws-amplify/storage';
import { Gallery } from 'next-gallery';
import RobdayLog from '@/app/ui/dashboard/robday-log';
import RobDayLogCard from "@/app/ui/dashboard/gallery/robday-log-card";
import { RobDayLogActivityProps,
  RobdayLogProps,
  LocationData, 
  // RobDayLogBaseActivityProps
} from "@/app/lib/definitions";



const getTodos = unstable_cache( async () => {
    return await fetchTodos();
}, ["todos"], {revalidate: 3600, tags: ["todos"]});

const getFilesInPublic = (): Promise<string[]> => {
  const fs = require('fs').promises;
  const path = require('path');

  const directoryPath = './public';

  return fs.readdir(directoryPath)
    .then((files: string[]) => {
      // Filter only files
      const fileNames = files.filter(file => {
        const filePath = path.join(directoryPath, file);
        return fs.statSync(filePath).isFile();
      });

      console.log('Files in the directory:');
      fileNames.forEach(fileName => {
        console.log(fileName);
      });

      return fileNames;
    })
    .catch((err: any) => {
      console.error('Error reading directory:', err);
      return [];
    });
}

async function getImageFileNames(): Promise<string[]> {
  // Determine the path to the public directory
  const publicDir = path.join(process.cwd(), 'public');
  
  // Read all files in the directory asynchronously
  const files = await fs.readdir(publicDir);
  
  // Define valid image extensions
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg'];
  
  // Filter out only those files that have one of the valid image extensions
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext);
  });
  
  return imageFiles;
}

async function getImageFilesFromS3(
  bucketName: string,
  region: string = 'us-east-1'
): Promise<string[]> {
  // Create an S3 client instance.
  const s3Client = new S3Client({ region });

  // Define valid image file extensions.
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];

  // This array will hold the keys of the image files.
  const imageKeys: string[] = [];

  // Setup parameters for the initial request.
  let continuationToken: string | undefined = undefined;

  do {
    const params: ListObjectsV2CommandInput = {
      Bucket: bucketName,
      ContinuationToken: continuationToken,
    };

    // List objects in the bucket.
    const command = new ListObjectsV2Command(params);
    const response = await s3Client.send(command);

    // If there are objects in this batch, filter them by image extension.
    if (response.Contents) {
      for (const object of response.Contents) {
        if (object.Key) {
          // Check if the key ends with one of the valid image extensions.
          const lowerKey = object.Key.toLowerCase();
          if (imageExtensions.some(ext => lowerKey.endsWith(ext))) {
            imageKeys.push(object.Key);
          }
        }
      }
    }

    // Update the continuationToken to check if there are more objects.
    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (continuationToken);

  return imageKeys;
}


export default async function Page() {
    // const filenames = await getImageFileNames();
    // const filenames = await getImageFilesFromS3('amplify-d2e7zdl8lpqran-ma-robdayimagesbuckete97c22-bwldlxhxdd4t');
    const storageFiles = await list({
        path: 'picture-submissions/',
        options: {
            listAll: true,
        }
    });
    const filenames = storageFiles.items.map(item => `https://amplify-d2e7zdl8lpqran-ma-robdayimagesbuckete97c22-bwldlxhxdd4t.s3.us-east-1.amazonaws.com/${item.path}`).filter(url => url.includes("4x3"));
    const filenames_3x4 = storageFiles.items.map(item => `https://amplify-d2e7zdl8lpqran-ma-robdayimagesbuckete97c22-bwldlxhxdd4t.s3.us-east-1.amazonaws.com/${item.path}`).filter(url => url.includes("3x4"));
    const filenames_1x1 = storageFiles.items.map(item => `https://amplify-d2e7zdl8lpqran-ma-robdayimagesbuckete97c22-bwldlxhxdd4t.s3.us-east-1.amazonaws.com/${item.path}`).filter(url => url.includes("1x1"));

    const images_4x3 = filenames.map((filename: string) => ({ src: filename, aspect_ratio: 4 / 3 }));
    const images_3x4 = filenames_3x4.map((filename: string) => ({ src: filename, aspect_ratio: 3 / 4 }));
    const images_1x1 = filenames_1x1.map((filename: string) => ({ src: filename, aspect_ratio: 1 / 1 }));

    const widths = [200];
    const ratios = [2.2, 4];

    const images = [...images_4x3, ...images_3x4, ...images_1x1];

    const todos = await getTodos();
    const robdaylogprop = {
      robdayLogId: "suckit",
      status: "Started" as "Started",
      robdayLogDate: "2025-03-17",
      robdayLogNumber: 100,
      notes: ["Suck it like a suck shaker"],
      robdayLogWeather: "hot hot hot",
      robdayLogTemperature: 69,
      rating: 100,
      cost: 100,
      duration: 0,
      startTime: new Date().getTime(),
      endTime: 0,
      totalTime: 0,
      baseActivities: [{ activityId: "suckit", activityName: "Suckit", activityDescription: "Suckit", activityCategories: ["Suckit"], activityImageUrl: "https://static-00.iconduck.com/assets.00/loading-icon-1024x1024-z5lrc2lo.png" }],
      aiProps: [{ activityInstanceId: "suckit", activityInstanceDisplayName: "Suckit", activityInstanceNotes: ["Suckit"], activityInstanceRating: 100, activityInstanceCost: 100, images: ["https://static-00.iconduck.com/assets.00/loading-icon-1024x1024-z5lrc2lo.png"], locationData: { id: "suckit", name: "Suckit", address: "Suckit" }, imageUrls: [...filenames], status: "Planned" as "Planned" }],
      urlsDict: {},
      locationData: [{ id: "suckit", name: "Suckit", address: "Suckit" }] as LocationData[]
    }
    return (
      <main>
        <Flex
            justifyContent="center"
            paddingX="32"
            paddingY="64"
            fillWidth
            gap="32"
            position="relative"
            mobileDirection='column'
          >
          <Background
            mask={{
              cursor: true,
            }}
            dots={{
              display: true,
              opacity: 50,
              color: "brand-solid-strong",
              size: "24",
            }}
            fill
            position="absolute"
            gradient={{
              display: true,
              opacity: 100,
              tilt: 0,
              height: 100,
              width: 200,
              x: 50,
              y: 0,
              colorStart: "brand-background-medium",
              colorEnd: "static-transparent",
            }}
          />
            <Column
              fillWidth
              gap="16"
              alignItems="center"
              justifyContent="center"
              >
              
              <TodoList todoProps={todos}/>
              <Column fillWidth fillHeight>
                <RobDayLogCard
                images={images}>
                  
                </RobDayLogCard>
                <RobdayLog 
                  robdayLogNumber={100}
                  robdayLogDate="2025-03-17"
                  robdayLogId="suckit"
                  robdayLogWeather="hot hot hot"
                  robdayLogTemperature={69}
                  baseActivities={robdaylogprop.baseActivities}
                  robdayLogActivityProps={[robdaylogprop.aiProps[0]]}
                  urlsDict={{}}
                  notes={robdaylogprop.notes}
                  locationData={robdaylogprop.locationData}
                  robDayLogProp={robdaylogprop}
                />
              </Column>
              <Column fillWidth fillHeight> 
                <Gallery {...{ images, widths, ratios }} lastRowBehavior="fill"/>
              </Column>
              {/* <Scroller 
                direction="column"
                // maxHeight={12}
                // fillHeight
                fillWidth
                gap="16"
                >
                  {filenames.map((filename: string) => {
                    return (
                      <Image
                        src={filename}
                        alt="Todo Image"
                        // fill
                        width={4032/32}
                        height={3024/32}
                      />
                    );
                  })}
                </Scroller> */}
            </Column>
        </Flex>
      </main>
    )
    
}