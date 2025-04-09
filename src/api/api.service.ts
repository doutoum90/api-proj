// api.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ApiService {
  async fetchGoogleNews(query: string): Promise<any> {
    const apiKey = process.env.GOOGLE_NEWS_API_KEY;
    const url = `https://news.google.com/rss/search?q=${query}&apiKey=${apiKey}`;
    const response = await axios.get(url);
    return response.data;
  }
}