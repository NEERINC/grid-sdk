import axios from 'axios';
import Sensor from './types/Sensor';

/**
 * Create a list of sensors
 * @see https://neer.stoplight.io/docs/neer-developers/b3A6MzU4OTMxMjQ-create-sensor-s
 */
type CreateSensorsInput = Omit<Sensor, 'id' | 'created_at' | 'updated_at'>[];

async function createSensors(input: CreateSensorsInput, apiKey: string, customEndpoint?: string): Promise<HttpResult<Sensor[]>> {
    // Validate the input
    input.forEach((o, i) => {
        if (o.latitude) {
            if (o.latitude < -90) throw new Error(`Item at index ${i + 1}: Latitude cannot be less than -90`);
            if (o.latitude > 90) throw new Error(`Item at index ${i + 1}: Latitude cannot be more than 90`);
        }
        if (o.longitude) {
            if (o.longitude < -180) throw new Error(`Item at index ${i + 1}: Longitude cannot be less than 180`);
            if (o.longitude > 180) throw new Error(`Item at index ${i + 1}: Longitude cannot be more than 180`);
        }
    });

    const endpoint = customEndpoint || 'https://api.neer.dev/sensors';
    const { status, data: result } = await axios.post<HttpResult<Sensor[]>>(endpoint, input, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey
        }
    });

    if (status !== 200) throw new Error(`Request to POST ${endpoint} failed with status ${status}: ${result.message || JSON.stringify(result.data)}`);

    return result;
}

export default createSensors;
