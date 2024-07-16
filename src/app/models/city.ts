class City {
  constructor(
    public name: string,
    public lat: string,
    public lon: string,
    public id: string = (new Date()).getTime().toString(),
    public todayForcast: Forcast | undefined = undefined,
    public nextDayForcasts: Forcast[] = []
  ) {}
}

class Forcast {
  constructor(
    public date: string,
    public temp: string,
    public wind: string,
    public humidity: string,
    public icon: string,
    public description: string
  ) {}
}

export { City, Forcast }
