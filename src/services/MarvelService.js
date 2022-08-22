class MarvelService {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/'
  _apiKey = 'apikey=5d7b3c898234430025fb8d48af4964d3' //my=a064f229c6cd9e4fe5e96b95b5ec4d3d4be9b777; all=c5d6fc8b83116d92ed468ce36bac6c62
  _baseOffset = 210

  getResource = async (url) => {
    let res = await fetch(url)

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`)
    }

    return res.json()
  }

  getAllCharacters = async (offset = this._baseOffset) => {
    const res = await this.getResource(
      `${this._apiBase}characters?${this._apiKey}&limit=9&offset=${offset}`
    )
    return res.data.results.map(this._transformCharacter)
  }

  getCharacter = async (id) => {
    const res = await this.getResource(
      `${this._apiBase}characters/${id}?${this._apiKey}`
    )
    return this._transformCharacter(res.data.results[0])
  }

  _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description
        ? char.description.slice(0, 120) + '...'
        : 'description is missing',
      thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    }
  }
}

export default MarvelService
