type Measurement = {
    /**
     * ID of the associated sensor
     */
    sensor_id: string;

    /**
     * Status of the sensor at time of measurement
     * @default 'ok'
     */
    status?: 'ok' | 'info' | 'warning' | 'error';

    /**
     * Message related to the status of the sensor at time of measurement
     */
    message?: string;

    /**
     * Value at time of measurement
     *
     * Can be left `null` in some situationsthe such as if the status is `error`, and a value couldn't be measured
     */
    value?: number;

    /**
     * Unix epoch when the measurement was read
     */
    read_at: number;

    /**
     * Unix epoch when the measurement was created
     *
     * Note: this is different from the `read_at` value
     */
    created_at: number;

    /**
     * Unix epoch when the measurement was last updated
     */
    updated_at: number;
}

export default Measurement;
