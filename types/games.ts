export type Game = {
    description: string,
    releaseDate: string,
    score: number,
    slug: string,
    title: string,
    image: string
}

export type Ticket = {
    _id: string,
    type: string,
    title: string,
    state: string,
    start_date: Date; 
  }