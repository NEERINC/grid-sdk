import { readFileSync } from 'fs';
import { join, resolve } from 'path';
import DataReader from './DataReader';

type AMIFormat = {
    ['Meter ID']: string;
    ['Serial Number']: string;
    ['Location']: string;
    ['Latitude']: number;
    ['Longitude']: number;
    ['Facility ID']: string;
};

const testsDir = resolve(__dirname, './tests');

describe('DataReader', () => {
    let dataReader: DataReader;

    beforeAll(() => {
        dataReader = new DataReader();
    });

    describe('Sites', () => {
        ['sites.csv', 'sites.xlsx'].map(fileName => {
            test(fileName, async () => {
                const buffer = readFileSync(join(testsDir, fileName));
                const result = await dataReader.parse<AMIFormat>(fileName.includes('xlsx') ? 'xlsx' : 'csv', buffer);
                expect(result[0]['Meter ID']).toBe(1);
                expect(result[1]['Meter ID']).toBe(2);
                expect(result[2]['Meter ID']).toBe(3);
                expect(result[0]['Serial Number']).toBe('A882FG');
                expect(result[1]['Serial Number']).toBe('A882FH');
                expect(result[2]['Serial Number']).toBe('A882FI');
                expect(result[0]['Location']).toBe('Moonlight Drive & 79th');
                expect(result[1]['Location']).toBe('Moonlight Drive & 80th');
                expect(result[2]['Location']).toBe('Moonlight Drive & 81st');
                expect(result[0]['Latitude']).toBe(39.10221);
                expect(result[1]['Latitude']).toBe(39.10231);
                expect(result[2]['Latitude']).toBe(39.10241);
                expect(result[0]['Longitude']).toBe(-117.67193);
                expect(result[1]['Longitude']).toBe(-117.67203);
                expect(result[2]['Longitude']).toBe(-117.67213);
                expect(result[0]['Facility ID']).toBe('WMFG-1');
                expect(result[1]['Facility ID']).toBe('WMFH-1');
                expect(result[2]['Facility ID']).toBe('WMFI-1');
            });
        });
    });
});
