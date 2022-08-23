import { useHttp } from '../hooks/http.hook'

const useMarvelService = () => {
  const { loading, request, error, clearError } = useHttp()

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/'
  const _apiKey = 'apikey=5d7b3c898234430025fb8d48af4964d3'
  //my=a064f229c6cd9e4fe5e96b95b5ec4d3d4be9b777; all=c5d6fc8b83116d92ed468ce36bac6c62
  const _baseCharOffset = 210
  const _baseComicOffset = 0

  const getAllCharacters = async (offset = _baseCharOffset) => {
    const res = await request(
      `${_apiBase}characters?${_apiKey}&limit=9&offset=${offset}`
    )
    return res.data.results.map(_transformCharacter)
  }

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`)
    return _transformCharacter(res.data.results[0])
  }

  const _transformCharacter = (char) => {
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

  const getAllComics = async (offset = _baseComicOffset) => {
    const res = await request(
      `${_apiBase}comics?${_apiKey}&orderBy=issueNumber&limit=8&offset=${offset}`
    )
    return res.data.results.map(_transformComic)
  }

  const _transformComic = (comic) => {
    return {
      id: comic.id,
      title: comic.title,
      description: comic.description
        ? comic.description
        : 'There is no description',
      pageCount: comic.pageCount
        ? `${comic.pageCount} p.`
        : 'No information about the number of pages',
      thumbnail: `${comic.thumbnail.path}.${comic.thumbnail.extension}`,
      language: comic.textObjects.language || 'en-us',
      price: comic.prices[0].price
        ? `${comic.prices[0].price}$`
        : 'not available',
    }
  }

  return {
    loading,
    error,
    getAllCharacters,
    getCharacter,
    getAllComics,
    clearError,
  }
}

export default useMarvelService
