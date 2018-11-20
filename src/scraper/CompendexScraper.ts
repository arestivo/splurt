const assert = require('assert')

import {Article} from '../data/Article'
import {Scraper} from './Scraper'

interface CompendexResult {
    title: string;
    source: string;
    sd: string;
    doi: string;
}

interface CompendexResponse {
    results: CompendexResult[];
}

/**
 * Checks if `response` has the expected format from a Compendex response.
 * If this function returns true, the user can assume the object follows the type `CompendexResponse`.
 * @param response
 */
function validateResponse(response: any): response is CompendexResponse {
    if (typeof response !== 'object' || response === null) {
        return false;
    }

    if (!response.hasOwnProperty('results')) {
        return false;
    }

    if (!Array.isArray(response.results)) {
        return false;
    }

    return response.results.every((result: any) =>
        result.hasOwnProperty('title') &&
        result.hasOwnProperty('source') &&
        result.hasOwnProperty('sd') &&
        result.hasOwnProperty('doi')
    )
}


export class CompendexScraper extends Scraper {
    private cookie?: string;

    constructor(cookie?: string) {
        super();
        this.cookie = cookie;
    }

    async query(q: string): Promise<any> {
        // TODO:
    }

    scrape(response: any): Article[] {
        if (!validateResponse(response)) {
            throw new Error('CompendexScraper: Unexpected format received.')
        }

        return response.results.map(({title, sd, doi}) => {
            /* The `sd` can be either "2018", or something like "June 2018" or "Aug. 2018".
             * Which is why we only need the last 4 digits. */
            const year: number = Number.parseInt(sd.slice(-4));

            assert(!Number.isNaN(year));

            return ({title, origin: 'Compendex', year, doi});
        })
    }
}
