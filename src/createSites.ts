import axios from 'axios';
import Site from './types/Site';

/**
 * Create a list of sites
 * @see https://neer.stoplight.io/docs/neer-developers/b3A6MzU0NzU1MTI-create-site-s
 */
type CreateSitesInput = Omit<Site, 'id' | 'created_at' | 'updated_at'>[];

async function createSites(input: CreateSitesInput, apiKey: string, customEndpoint?: string): Promise<HttpResult<Site[]>> {
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

    const endpoint = customEndpoint || 'https://api.neer.dev/sites';
    const { status, data: result } = await axios.post<HttpResult<Site[]>>(endpoint, input, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey
        }
    });

    if (status !== 200) throw new Error(`Request to POST ${endpoint} failed with status ${status}: ${result.message || JSON.stringify(result.data)}`);

    return result;
}

export default createSites;
