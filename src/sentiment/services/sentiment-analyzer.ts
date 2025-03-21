export class SentimentAnalyzer {
    private readonly positiveWords = ['good', 'great', 'excellent', 'positive'];
    private readonly negativeWords = ['bad', 'poor', 'terrible', 'negative'];

    getSentiment(text: string): number {
        const words = text.toLowerCase().split(/\W+/);
        const positive = words.filter(word => this.positiveWords.includes(word)).length;
        const negative = words.filter(word => this.negativeWords.includes(word)).length;
        return (positive - negative) / words.length;
    }

    getMagnitude(text: string): number {
        return text.split(/\W+/).length / 100;
    }
}