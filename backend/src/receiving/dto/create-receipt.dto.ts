export interface CreateReceiptDto {
  supplierId: number;
  date?: string; // ISO string, опционально (по умолчанию now)
}