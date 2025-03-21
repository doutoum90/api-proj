import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TwitterService {
    constructor(private readonly httpService: HttpService) { }

    async search(competitorId: string): Promise<string[]> {
        const { data } = await firstValueFrom(
            this.httpService.get(`https://api.twitter.com/2/tweets/search/recent`, {
                params: {
                    query: competitorId,
                    max_results: 100
                },
                headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` }
            })
        );
        return data.data.map(tweet => tweet.text);
    }
}
