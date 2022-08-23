import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'
import useMarvelService from '../../services/MarvelService'

import './comicsList.scss'

const ComicsList = () => {
  const [comicList, setComicList] = useState([])
  const [newItemLoading, setNewItemLoading] = useState(false)
  const [offset, setOffset] = useState(210)
  const [comicEnded, setComicEnded] = useState(false)

  const { loading, error, getAllComics } = useMarvelService()

  useEffect(() => {
    onRequest(offset, true)
  }, [])

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true)
    getAllComics(offset).then(onComicListLoaded)
  }

  const onComicListLoaded = (newComicList) => {
    let ended = false
    if (newComicList.length < 8) {
      ended = true
    }
    setComicList((comicList) => [...comicList, ...newComicList])
    setNewItemLoading(false)
    setOffset((offset) => offset + 8)
    setComicEnded(ended)
  }

  function renderItems(arr) {
    const items = arr.map(({ id, title, thumbnail, price }, i) => {
      return (
        <li className="comics__item" key={i}>
          <Link to={`/comics/${id}`}>
            <img src={thumbnail} alt={title} className="comics__item-img" />
            <div className="comics__item-name">{title}</div>
            <div className="comics__item-price">{price}</div>
          </Link>
        </li>
      )
    })
    return <ul className="comics__grid">{items}</ul>
  }

  const items = renderItems(comicList)

  const errorMessage = error ? <ErrorMessage /> : null
  const spinner = loading && !newItemLoading ? <Spinner /> : null

  return (
    <div className="comics__list">
      {errorMessage}
      {spinner}
      {items}
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: comicEnded ? 'none' : 'block' }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  )
}

export default ComicsList
