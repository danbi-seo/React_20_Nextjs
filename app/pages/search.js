import { getRegExp } from "korean-regexp"
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux'
import { selectPokemonByRegExp } from "../RTK/selector"
import { Card } from "../component/Card"

export default function Search() {
  // useRouter 훅을 사용하여 쿼리 파라미터 가져오기
  // ?pokemon=값 형태로 파라미터 가져오기
  const router = useRouter();
  const { pokemon } = router.query; 

  const param = searchParams.get('pokemon')
  const reg = getRegExp(pokemon)  // param을 정규식으로 변환
  const pokemonData = useSelector(selectPokemonByRegExp(reg)) //위에 reg를 정규식에 담아주기
  console.log(pokemon)
  return (
  <>
    {pokemonData.map(el => <Card key={el.id} pokemon={el} />)}
  </>)
}