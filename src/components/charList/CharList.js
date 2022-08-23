import { useState, useEffect, useRef } from 'react'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'
import useMarvelService from '../../services/MarvelService'
import PropTypes from 'prop-types'
import './charList.scss'

const CharList = (props) => {
  const [charList, setCharList] = useState([])
  const [newItemLoading, setNewItemLoading] = useState(false)
  const [offset, setOffset] = useState(210)
  const [charEnded, setCharEnded] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const { loading, error, getAllCharacters } = useMarvelService()

  useEffect(() => {
    onRequest(offset, true)
  }, [])

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true)
    getAllCharacters(offset).then(onCharListLoaded)
  }

  const onCharListLoaded = (newCharList) => {
    let ended = false
    if (newCharList.length < 9) {
      ended = true
    }
    setCharList((charList) => [...charList, ...newCharList])
    setNewItemLoading(false)
    setOffset((offset) => offset + 9)
    setCharEnded(ended)
  }

  let itemRefs = useRef({})

  const onCharSelected = (id) => {
    if (selectedItem) {
      itemRefs.current[selectedItem].classList.remove('char__item_selected')
    }
    setSelectedItem(id)
    itemRefs.current[id].classList.add('char__item_selected')
  }

  function renderItems(arr) {
    const items = arr.map(({ id, name, thumbnail }) => {
      let style = null
      if (thumbnail && thumbnail.includes('image_not_available')) {
        style = { objectFit: 'contain' }
      }
      return (
        <li
          ref={(elem) => {
            itemRefs.current[id] = elem
          }}
          className="char__item"
          key={id}
          onClick={() => {
            onCharSelected(id)
            props.onCharSelected(id)
          }}
          onKeyPress={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              onCharSelected(id)
              props.onCharSelected(id)
            }
          }}
        >
          <img src={thumbnail} alt={name} style={style} />
          <div className="char__name">{name}</div>
        </li>
      )
    })
    return <ul className="char__grid">{items}</ul>
  }

  const items = renderItems(charList)

  const errorMessage = error ? <ErrorMessage /> : null
  const spinner = loading && !newItemLoading ? <Spinner /> : null

  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      {items}
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: charEnded ? 'none' : 'block' }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  )
}

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
}

export default CharList
