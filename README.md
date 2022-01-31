# neer-timeseries-importer

JavaScript library for easily importing timeseries data into NEER Grid™

## Getting Started

Install the package using NPM
```sh
npm install --save @neerinc/timeseries-importer
```

### Example

Assume you have an Excel file of sites, like so:
| Meter ID | Serial Number | Location               | Latitude | Longitude  | Facility ID |
| -------- | ------------- | ---------------------- | -------- | ---------- | ----------- |
| 1        | A882FG        | Moonlight Drive & 79th | 39.10221 | -117.67193 | WMFG-1      |
| 2        | A882FH        | Moonlight Drive & 80th | 39.10231 | -117.67203 | WMFH-1      |
| 3        | A882FI        | Moonlight Drive & 81st | 39.10241 | -117.67213 | WMFI-1      |

In this example, these are AMI sensors, so we know that all of the sites will need a single `flow` sensor to go along with it.

Your goal is to map the data from this excel file into a format that the NEER Developers API can accept when creating your sites and sensors.

To accomplish this, we're going to follow these steps:

1. Use the [DataReader](./src/utilities/DataReader) to parse the excel file
   
   _Pass a generic type to the `parse` method to get a strongly typed result_

2. Map the parsed data into the required input to create the new sites through the API
3. Using the returned array of created sites (with their newly added ID's now), construct the sensor input data for each one and then create them through the API
```ts
import { DataReader } from '@neerinc/timeseries-importer';
import axios from 'axios';
import { readFileSync } from 'fs';
import { join } from 'path';

type SitesFileFormat = {
    ['Meter ID']: string;
    ['Serial Number']: string;
    ['Location']: string;
    ['Latitude']: number;
    ['Longitude']: number;
    ['Facility ID']: string;
};

const apiKey = process.env.NEER_API_KEY;

async function run() {
    // Step 1

    const sitesFilePath = join(__dirname, 'sites.xlsx');
    const sitesFileBuffer = readFileSync(sitesFilePath);
    const dataReader = new DataReader();
    const data = await dataReader.parse<SitesFileFormat>('xlsx', buffer);

    // Step 2

    const createSitesInput = data.map(row => {
        return {
            client_id: 2, // the client you're to insert the sites for, see https://neer.stoplight.io/docs/neer-developers/b3A6MzUyNzU1MjM-get-clients
            facility_id: row['Facility ID'],
            name: row['Meter ID'],
            description: row['Location'],
            latitude: row['Latitude'],
            longitude: row['Longitude']
        }
    });

    const { status: status1, data: result1 } = await axios.post('https://api.neer.dev/sites', createSitesInput, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey
        }
    });
    if (status1 !== 200) { /* handle error */ }
    const createdSites = result1.data; // array of sites: https://neer.stoplight.io/docs/neer-developers/c2NoOjM1Mjg0MzE5-site

    // Step 3

    const createSensorsInput = createdSites.map(createdSite => {
        const matchingRowFromData = data.find(row => row['Meter ID'] === createdSite.name);
        const serialNumber = matchingRowFromData['Serial Number'];

        return {
            site_id: createdSite.id,
            name: `${createdSite.name}_flow_meter`, // optional
            type: 'flow',
            style: 'volumetric', // optional
            system: 'drinking water',
            label: 'Flow', // optional
            units: 'cfs',
            metadata: {
                serial_number: serialNumber
            },
            tags: ['AMI']
        }
    });

    const { status: status2, data: result2 } = await axios.post('https://api.neer.dev/sensors', createSensorsInput, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey
        }
    });
    if (status2 !== 200) { /* handle error */ }
    const createdSites = result1.data; // array of sensors: https://neer.stoplight.io/docs/neer-developers/c2NoOjM1Mjk5Njg1-sensor
}


