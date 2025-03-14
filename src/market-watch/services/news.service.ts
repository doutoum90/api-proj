import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { NewsItemDto } from '../dto/news-item.dto';

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);

  constructor(private readonly httpService: HttpService) { }

  private readonly SOURCES = {
    GOOGLE_NEWS: (sector, lang) =>
      `https://news.google.com/rss/search?q=${sector}&hl=${lang}&gl=${lang.toUpperCase()}&ceid=${lang}:FR`,
    NEWSAPI: (sector, lang) =>
      `https://newsapi.org/v2/everything?q=${sector}&language=${lang}&sortBy=publishedAt`
  };

  async getAggregatedNews(sector: string, lang: string): Promise<NewsItemDto[]> {
    try {
      const [googleNews, newsApi] = await Promise.all([
        this.fetchGoogleNews(sector, lang),
        this.fetchNewsApi(sector, lang)
      ]);

      return this.mergeAndSortResults([...googleNews, ...newsApi]);
    } catch (error) {
      this.logger.error(`Error fetching news: ${error.message}`);
      return [];
    }
  }

  private async fetchGoogleNews(sector: string, lang: string): Promise<NewsItemDto[]> {
    const { data } = await firstValueFrom(
      this.httpService.get(this.SOURCES.GOOGLE_NEWS(sector, lang)).pipe(
        catchError((error) => {
          throw new Error(`Google News failed: ${error.message}`);
        })
      )
    );

    return this.parseGoogleNews(data, sector);
  }

  private async fetchNewsApi(sector: string, lang: string): Promise<NewsItemDto[]> {
    const { data } = await firstValueFrom(
      this.httpService.get(this.SOURCES.NEWSAPI(sector, lang), {
        headers: { 'X-Api-Key': process.env.NEWSAPI_KEY }
      }).pipe(
        catchError((error) => {
          throw new Error(`NewsAPI failed: ${error.message}`);
        })
      )
    );

    return data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name,
      publishedAt: new Date(article.publishedAt),
      imageUrl: article.urlToImage,
      category: sector
    }));
  }

  private parseGoogleNews(xmlData: string, sector: string): NewsItemDto[] {
    // Implémentation d'un parser XML custom
    const items: NewsItemDto[] = [];
    const regex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = regex.exec(xmlData)) !== null) {
      const itemContent = match[1];
      const getValue = (tag: string) =>
        itemContent.match(new RegExp(`<${tag}>([\\s\\S]*?)<\/${tag}>`))?.[1] || '';

      items.push({
        title: getValue('title'),
        description: getValue('description'),
        url: getValue('link'),
        source: getValue('source'),
        publishedAt: new Date(getValue('pubDate')),
        imageUrl: this.extractImageUrl(itemContent),
        category: sector
      });
    }
    return items;
  }

  private mergeAndSortResults(results: NewsItemDto[]): NewsItemDto[] {
    // Fusion et déduplication
    const uniqueResults = Array.from(new Set(results.map(item => item.url)))
      .map(url => results.find(item => item.url === url))
      .filter((item): item is NewsItemDto => item !== undefined);

    return uniqueResults
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, 20); // Limite à 20 résultats
  }

  private extractImageUrl(content: string): string {
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = content.match(imgRegex);
    return match ? match[1] : '';
  }
}