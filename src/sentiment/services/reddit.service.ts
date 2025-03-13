import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
@Injectable()
export class RedditService {
  constructor(private readonly httpService: HttpService) {}

  async search(competitorId: string): Promise<string[]> {
    const { data } = await firstValueFrom(
      this.httpService.get(`https://www.reddit.com/search.json`, {
        params: { q: competitorId, limit: 100 }
      })
    );
    return data.data.children.map(post => post.data.title + ' ' + post.data.selftext);
  }
}