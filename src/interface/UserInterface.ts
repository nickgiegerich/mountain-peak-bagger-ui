import { PeakInterface } from "./PeakInterface";

export interface UserInterface {
    id: number;
    username: string;
    is_active: boolean;
    created: string;
    updated: string;
  }
  
  export interface AuthedUser {
    user: UserInterface;
    access: string;
    currentPeak?: PeakInterface
  }