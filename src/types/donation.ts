
export interface Donation {
  id: string;
  name: string;
  email: string;
  amount: number;
  method: string;
  date: string;
  message?: string;
  user_id?: string;
  department?: string;
  year?: string;
  anonymous?: boolean;
  donorType?: string;
}
