import { Injectable } from "@nestjs/common";
import { TwitterService } from "./twitter.service";
import { RedditService } from "./reddit.service";
import { SentimentAnalyzer } from "./sentiment-analyzer";


@Injectable()
export class SentimentService {
  constructor(
    private readonly twitterService: TwitterService,
    private readonly redditService: RedditService,
    private readonly analyzer: SentimentAnalyzer
  ) { }

  async analyzeSocialMedia(competitorId: string) {
    const tweets = await this.twitterService.search(competitorId);
    const redditPosts = await this.redditService.search(competitorId);

    return {
      twitter: this.analyzeSentiment(tweets),
      reddit: this.analyzeSentiment(redditPosts),
      overallScore: this.calculateOverallScore(tweets, redditPosts)
    };
  }

  private analyzeSentiment(content: string[]) {
    return content.map(text => ({
      text,
      score: this.analyzer.getSentiment(text),
      magnitude: this.analyzer.getMagnitude(text)
    }));
  }
  private calculateOverallScore(tweets: any[], redditPosts: any[]): number {
    const twitterScore = tweets.reduce((sum, t) => sum + t.score, 0) / tweets.length || 0;
    const redditScore = redditPosts.reduce((sum, p) => sum + p.score, 0) / redditPosts.length || 0;
    return (twitterScore * 0.6 + redditScore * 0.4) * 100; // Score sur 100
  }
}