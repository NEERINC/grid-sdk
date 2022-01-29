type Sensor = {
    id: string;
    site_id: string;
    name?: string;
    description?: string;
    connection?: 'wired' | 'wireless';
    type: 'electrical' | 'flow' | 'force' | 'humidity' | 'level' | 'motion' | 'other' | 'ping' | 'pressure' | 'rain' | 'state' | 'temperature' | 'velocity' | 'vibration' | 'water quality';
    style?: string;
    virtual?: boolean;
    system: 'drinking water' | 'stormwater' | 'wastewater';
    label?: string;
    units: string;
    latitude?: number;
    longitude?: number;
    metadata?: Record<string, unknown>;
    tags?: string[];
    created_at: number;
    updated_at: number;
}

export default Sensor;
