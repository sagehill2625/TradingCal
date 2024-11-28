export interface Trade {
  id: string;
  symbol: string;
  priceFormat: number;
  priceFormatType: number;
  tickSize: number;
  buyFillId: string;
  sellFillId: string;
  qty: number;
  buyPrice: number;
  sellPrice: number;
  pnl: number;
  boughtTimestamp: string;
  soldTimestamp: string;
  duration: string;
}

export interface TradeDay {
  date: Date;
  trades: Trade[];
  totalPnl: number;
}