export interface IApiResponse {
  message: string;
  success: boolean;
  data?: Document | Document[] | null;
}
