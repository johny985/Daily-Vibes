export interface Diary {
  content: string;
  contentDate: string;
  vibe: string;
}

export interface LoginFormInputs {
  email: string;
  password: string;
}

export interface SignUpFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ChartData {
  name: string;
  vibe: string;
  count: number;
}

export interface Vibes {
  Happy: string;
  Sad: string;
  Exhausted: string;
  Angry: string;
}
