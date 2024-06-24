export interface Integration {
  id: string;
  name: string;
  type: string;
  url?: string;
  imageUrl: string | null;
  widgetsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
