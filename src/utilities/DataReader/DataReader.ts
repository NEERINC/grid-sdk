import { Workbook, Worksheet } from 'exceljs';
import { Readable } from 'stream';
import {
    DataReaderOptions,
    DataReaderResult
} from './DataReader.types';

class DataReader {
    protected options?: DataReaderOptions;

    constructor(options?: DataReaderOptions) {
        this.options = options;
    }

    public async parse<TFormat extends Record<string, unknown>>(type: 'xlsx' | 'csv', buffer: Buffer): Promise<DataReaderResult<TFormat>> {
        const stream = Readable.from(buffer);

        const workbook = new Workbook();
        const worksheet = type === 'xlsx'
            ? (await workbook.xlsx.read(stream)).worksheets[0]
            : await workbook.csv.read(stream);

        const header = worksheet.getRow(1);
        const data = worksheet.getRows(2, worksheet.rowCount);
        if (!data) throw new Error('No data found in file.');

        let result: DataReaderResult<TFormat> = [];
        data.forEach(row => {
            const data: Record<string, unknown> = {};
            row.eachCell((cell, colNumber) => {
                const headerKey = header.getCell(colNumber).text;
                data[headerKey] = cell.value;
            });
            result.push(data as TFormat);
        });

        return result;
    }
}

export default DataReader;
