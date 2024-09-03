import { ServerRespond } from "./DataStreamer";

export interface Row {
  ratio: number | undefined;
  uthresh: number;
  lthresh: number;
  alert: number | undefined;
  timestamp: Date;
}

const thresh = 0.05;

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row {
    const [a, b] = serverResponds;

    const price_a = (a.top_ask.price + a.top_bid.price) / 2;
    const price_b = (b.top_ask.price + b.top_bid.price) / 2;
    const ratio = price_a / price_b;

    const lthresh = 1.0 - thresh;
    const uthresh = 1.0 + thresh;
    const alert = ratio < lthresh || ratio > uthresh ? ratio : undefined;

    const timestamp = new Date(
      Math.max(+new Date(a.timestamp), +new Date(b.timestamp))
    );

    return {
      ratio,
      lthresh,
      uthresh,
      alert,
      timestamp,
    };
  }
}
