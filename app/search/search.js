import { useRouter } from 'next/router';  
import { useSelector } from 'react-redux';
import { getRegExp } from 'korean-regexp';
import { selectPokemonByRegExp } from '../RTK/selector'; 
import { Card } from '../components/Card';  

export default function Search() {
  const router = useRouter();
  const { pokemon } = router.query;  // URL 파라미터에서 pokemon 추출
  const reg = getRegExp(pokemon);  // param을 정규식으로 변환
  // Redux에서 정규식에 맞는 포켓몬 데이터를 필터링
  const pokemonData = useSelector(selectPokemonByRegExp(reg));

  return (
  <>
    {pokemonData.map((el) => <Card key={el.id} pokemon={el} />)}
  </>)
}
