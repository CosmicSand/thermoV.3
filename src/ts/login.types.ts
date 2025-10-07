export type SensorsResponse = {
  [key: string]: {
    [key: string]: string[];
  };
};

export type LoginData = {
  username: string;
  password: string;
  topic: string;
  port: number;
};
