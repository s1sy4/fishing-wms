export interface CreateInventoryDto {
  name: string;
  serial_number: string;
  typeId: number;
  cellId: number;
  status?: string;
  condition?: string;
  purchase_date?: string;
  purchase_price?: number;
}