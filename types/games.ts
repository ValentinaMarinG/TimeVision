export type Game = {
    description: string,
    releaseDate: string,
    score: number,
    slug: string,
    title: string,
    image: string
}

export type Ticket = {
    id: string,
    type: string,
    title: string,
    start_date: Date; 
  }