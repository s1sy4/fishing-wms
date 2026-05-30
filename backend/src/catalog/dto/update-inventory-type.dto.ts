export interface UpdateInventoryTypeDto {
  name?: string;
  description?: string;
  rental_price?: number;
  deposit?: number;
  requires_assembly?: boolean;
}