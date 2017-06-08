export class Task {
  id: number;
  isProcessing = false;
  title: string;
  activity: string;
  percentage: number;
  earned: number;
  price: number;
  action: {
    title: string,
    doIt: any
  };
  task: {
    PID: number,
    ATID: number,
    TID: number,
    CID: number,
    emotions: string
  };
}