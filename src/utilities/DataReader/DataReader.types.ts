export type DataReaderOptions = {
    type: 'sites' | 'sensors' | 'measurements';
}

export type DataReaderResult<TFormat extends Record<string, unknown>> = Array<TFormat>;
