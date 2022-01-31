import axios from 'axios';
import Measurement from './types/Measurement';

/**
 * Create a list of sensors
 * @see https://neer.stoplight.io/docs/neer-developers/b3A6MzU3MTAyNTQ-create-measurement-s
 */
type CreateMeasurementsInput = Omit<Measurement, 'id' | 'created_at' | 'updated_at'>[];

async function createMeasurements(input: CreateMeasurementsInput, apiKey: string, customEndpoint?: string): Promise<HttpResult<Measurement[]>> {
    const endpoint = customEndpoint || 'https://api.neer.dev/measurements';
    const { status, data: result } = await axios.post<HttpResult<Measurement[]>>(endpoint, input, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey
        }
    });

    if (status !== 200) throw new Error(`Request to POST ${endpoint} failed with status ${status}: ${result.message || JSON.stringify(result.data)}`);

    return result;
}

export default createMeasurements;
