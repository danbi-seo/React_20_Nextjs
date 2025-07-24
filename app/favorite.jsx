import { useSelector } from 'react-redux'
import { selectFavoritePokemons } from "../redux/selector"
import { Card } from '../component/Card'

export default function Favorite() {
  const pokemon = useSelector(selectFavoritePokemons) //인자를 따로 전달받을 필요없이 그대로 넣고 다시 변수로 담음
  return (
  <>
    {pokemon.map(el => <Card key={el.id} pokemon={el} />)}
  </>)
}