import {Article} from '../data/Article'
import {Scraper} from './Scraper'

interface CompendexResult {
    title: string;
    source: string;
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

    return response.results.every((result: any) => result.hasOwnProperty('title') && result.hasOwnProperty('source'))
}


export class CompendexScraper extends Scraper {
    async query(q: string): Promise<any> {
        // TODO:
    }

    scrape(response: any): Article[] {
        if (!validateResponse(response)) {
            throw new Error('CompendexScraper: Unexpected format received.')
        }

        return response.results.map(result => ({title: result.title}))
    }
}
