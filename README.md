# neer-timeseries-importer

JavaScript library for easily importing timeseries data into NEER Grid™

## Getting Started

Install the package using NPM
```sh
npm install --save @neerinc/timeseries-importer
```

Read an excel file containing your sites, sensors, or measurements
```ts
import { readFileSync } from 'fs';
import { join } from 'path';

const sitesFilePath = join(__dirname, 'sites.xlsx');
const sitesFileBuffer = readFileSync(sitesFilePath);
```

Use the [DataReader](./src/utilities/DataReader) to parse the excel file

_Pass a generic type to the `parse` method to get a strongly typed result_
```ts
// ...

import { DataReader } from '@neerinc/timeseries-importer';

type SitesFileFormat = {
    ['Meter ID']: string;
    ['Serial Number']: string;
    ['Location']: string;
    ['Latitude']: number;
    ['Longitude']: number;
    ['Facility ID']: string;
};

const dataReader = new DataReader();
const data = await dataReader.parse<SitesFileFormat>(sitesFileBuffer);
```

Map the parsed data into the required input to create new sites on the NEER Grid™
```ts
// ...

import { createSites } from '@neerinc/timeseries-importer';

const apiKey = process.env.NEER_API_KEY;

const createdSites = await createSites(
    data.map(row => {
        return {
            client_id: 2, // the client you're to insert the sites for, see https://neer.stoplight.io/docs/neer-developers/b3A6MzUyNzU1MjM-get-clients
            facility_id: row['Facility ID'],
            name: row['Meter ID'],
            description: row['Location'],
            latitude: row['Latitude'],
            longitude: row['Longitude'],
            metadata: {
                serial_number: row['Serial Number']
            },
            tags: ['AMI']
        }
    }),
    apiKey
)
```

Now lets create a new sensor for each site that was created
```ts
// ...

import { createSensors } from '@neerinc/timeseries-importer';

const createdSensors = await createSensors(
    createdSites.map(createdSite => {
        return {
            site_id: createdSite.id,
            name: `${createdSite.name}_flow_meter`, // optional
            type: 'flow',
            style: 'volumetric', // optional
            system: 'drinking water',
            label: 'Flow', // optional
            units: 'cfs'
        }
    }),
    apiKey
)
