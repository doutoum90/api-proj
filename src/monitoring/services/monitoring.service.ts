import { Injectable } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { FinancialService } from "src/financial/financial.service";
import { CompetitorService } from "src/competitor/competitor.service";
import { SentimentService } from "src/sentiment/services/sentiment.service";
import { NotificationService } from "src/notification/notification.service";

// monitoring.service.ts
@Injectable()
export class MonitoringService {
  private thresholds = {
    stockPrice: 0.05, // 5% change
    sentiment: 0.2    // 20% drop
  };
  constructor(
    private readonly competitorService: CompetitorService,
    private readonly financialService: FinancialService,
    private readonly sentimentService: SentimentService,
    private readonly notificationService: NotificationService
  ) {}

  @Interval(300000) // Toutes les 5 minutes
  async checkChanges() {
    const competitors = await this.competitorService.findAll();
    
    competitors.forEach(async competitor => {
      const changes = await this.detectSignificantChanges(competitor.id);
      if (changes.length > 0) {
        await this.notificationService.sendAlert({
          competitorId: competitor.id,
          changes,
          severity: 'high'
        });
      }
    });
  }

  private async detectSignificantChanges(competitorId: string) {
    const [financials, sentiment] = await Promise.all([
      this.financialService.getFinancialData(competitorId),
      this.sentimentService.analyzeSocialMedia(competitorId)
    ]);

    return [
      ...this.checkFinancialChanges(financials),
      ...this.checkSentimentChanges(sentiment)
    ];
  }

  private checkFinancialChanges(financialData: any) {
    const changes: any[] = [];
    if (Math.abs(financialData.priceChange) > this.thresholds.stockPrice) {
      changes.push({
        type: 'FINANCIAL',
        metric: 'stockPrice',
        change: financialData.priceChange,
        message: `Changement important du cours action: ${(financialData.priceChange * 100).toFixed(2)}%`
      });
    }
    return changes;
  }

  private checkSentimentChanges(sentimentData: any) {
    const changes: any[] = [];
    if (sentimentData.scoreChange < -this.thresholds.sentiment) {
      changes.push({
        type: 'SENTIMENT',
        metric: 'sentimentScore',
        change: sentimentData.scoreChange,
        message: `Changement significatif du sentiment: ${(sentimentData.scoreChange * 100).toFixed(2)}%`
      });
    }
    return changes;
  }
}