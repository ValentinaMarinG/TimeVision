export type Game = {
  description: string;
  releaseDate: string;
  score: number;
  slug: string;
  title: string;
  image: string;
};

export type Ticket = {
  _id: string;
  type: string;
  title: string;
  state: string;
  description: string;
  start_date: Date;
};

export type Shift = {
  _id: string;
  name_shift: string;
  start_date: Date;
  end_date: Date;
  time_start: Date;
  time_end: Date;
};
