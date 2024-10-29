export type Ticket = {
  _id: string;
  type: string;
  title: string;
  state: string;
  description: string;
  start_date: Date;
  end_date: Date;
};

export type Shift = {
  _id: string;
  name_shift: string;
  start_date: Date;
  end_date: Date;
  time_start: Date;
  time_end: Date;
};

export type User = {
  _id: string,
  name: string,
  lastname: string,
  type_doc: string,
  num_doc: string,
  position: string,
  id_department: string,
  email: string,
  photo: string | undefined
}