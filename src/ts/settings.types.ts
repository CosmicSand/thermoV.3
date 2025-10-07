export type SavedSettings = {
  [key: string]: {
    [key: string]: { [key: string]: string | number[] };
  };
};
