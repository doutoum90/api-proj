import { Injectable } from '@nestjs/common';
import * as natural from 'natural';

@Injectable()
export class AnalysisService {
  async analyzeSentiment(text: string): Promise<string> {
    const analyzer = new natural.SentimentAnalyzer('French', natural.PorterStemmer, 'afinn');
    const score = analyzer.getSentiment(text.split(' '));
    return score > 0 ? 'positif' : score < 0 ? 'négatif' : 'neutre';
  }
}