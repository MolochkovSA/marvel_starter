import { Component } from 'react'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'
import MarvelService from '../../services/MarvelService'
import PropTypes from 'prop-types'
import './charList.scss'

class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    error: false,
    newItemLoading: false,
    offset: 210,
    charEnded: false,
    selectedItem: null,
  }

  marvelService = new MarvelService()

  componentDidMount() {
    this.onRequest()
  }

  onRequest = (offset) => {
    this.onCharListLoading()
    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharListLoaded)
      .catch(this.onError)
  }

  onCharListLoading = () => {
    this.setState({
      newItemLoading: true,
    })
  }

  onCharListLoaded = (newCharList) => {
    let ended = false
    if (newCharList.length < 9) {
      ended = true
    }

    this.setState(({ offset, charList }) => ({
      charList: [...charList, ...newCharList],
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charEnded: ended,
    }))
  }

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    })
  }

  setItemRef = (elem, id) => {
    this[id] = elem
  }

  onCharSelected = (id) => {
    const lastId = this.state.selectedItem
    if (lastId) {
      this[lastId].classList.remove('char__item_selected')
    }
    this.setState({
      selectedItem: id,
    })
    this[id].classList.add('char__item_selected')
    this.props.onCharSelected(id)
  }

  renderItems(arr) {
    const items = arr.map(({ id, name, thumbnail }) => {
      let style = null
      if (thumbnail && thumbnail.includes('image_not_available')) {
        style = { objectFit: 'contain' }
      }
      return (
        <li
          ref={(elem) => this.setItemRef(elem, id)}
          className="char__item"
          key={id}
          onClick={() => this.onCharSelected(id)}
          onKeyPress={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              this.onCharSelected(id)
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

  render() {
    const { charList, loading, error, offset, newItemLoading, charEnded } =
      this.state

    const items = this.renderItems(charList)

    const errorMessage = error ? <ErrorMessage /> : null
    const spinner = loading ? <Spinner /> : null
    const content = !(loading || error) ? items : null

    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button
          className="button button__main button__long"
          disabled={newItemLoading}
          style={{ display: charEnded ? 'none' : 'block' }}
          onClick={() => this.onRequest(offset)}
        >
          <div className="inner">load more</div>
        </button>
      </div>
    )
  }
}

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
}

export default CharList
