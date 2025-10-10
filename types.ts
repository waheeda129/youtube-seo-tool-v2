export interface Keyword {
  keyword: string;
  volume: 'Low' | 'Medium' | 'High';
  competition: 'Low' | 'Medium' | 'High';
  opportunityScore: number;
}

export interface KeywordCluster {
  clusterName: string;
  keywords: Keyword[];
}

export interface KeywordData {
  clusters: KeywordCluster[];
}

export interface ContentIdeas {
  title: string;
  description: string;
  tags: string[];
}
