export interface AdminSendMailDTO {
  from: string;
  to: string;
  subject: string;
  salutation: string;
  message: string;
  cta?: string;
  url?: string;
}
