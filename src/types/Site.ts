type Site = {
    /**
     * Unique ID of the site
     */
    id: string;

    /**
     * Client identifier
     */
    client_id: number;

    /**
     * Facility ID
     */
    facility_id?: string;

    /**
     * Site name
     */
    name?: string;

    /**
     * Site description
     */
    description?: string;

    /**
     * Latitude where the site is located
     */
    latitude?: number;

    /**
     * Longitude where the site is located
     */
    longitude?: number;

    /**
     * Additional arbitrary information about the site
     */
    metadata?: Record<string, unknown>;

    /**
     * Array of tags to help define the site
     */
    tags?: string[];

    /**
     * Unix epoch when the site was created
     */
    created_at: number;

    /**
     * Unix epoch when the site was last updated
     */
    updated_at: number;
};

export default Site;
