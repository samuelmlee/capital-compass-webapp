export type NewsPublisher = {
  name: string
}

export type NewsResult = {
  publisher: NewsPublisher
  title: string
  author: string
  publishedUtc: Date
  articleUrl: string
  tickers: string[]
  imageUrl: string
  description: string
  keywords: string[]
}

export type NewsResponse = {
  results: NewsResult[]
  nextCursor: string
}
