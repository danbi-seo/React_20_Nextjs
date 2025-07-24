"use client";
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectPokemonById } from '../../RTK/selector'; 
import FlipCard from '@/components/FlipCard'; 
import FavoriteButton from '@/components/FavoriteButton'; 
import styled from 'styled-components';
import { getPokemonData } from '@/redux/thunk';

const typeColors = {
  '노말': { base: '#A8A77A', border: '#8A8A6E' },
  '불꽃': { base: '#EE8130', border: '#C26928' },
  '물': { base: '#6390F0', border: '#4F74C2' },
  '풀': { base: '#7AC74C', border: '#629E3E' },
  '전기': { base: '#F7D02C', border: '#C7A623' },
  '얼음': { base: '#96D9D6', border: '#7AB0AE' },
  '격투': { base: '#C22E28', border: '#9B2520' },
  '독': { base: '#A33EA1', border: '#823280' },
  '땅': { base: '#E2BF65', border: '#B59952' },
  '비행': { base: '#A98FF3', border: '#8772C2' },
  '에스퍼': { base: '#F95587', border: '#C7456D' },
  '벌레': { base: '#A6B91A', border: '#859415' },
  '바위': { base: '#B6A136', border: '#91812B' },
  '고스트': { base: '#735797', border: '#5C467A' },
  '드래곤': { base: '#6F35FC', border: '#592AB0' },
  '강철': { base: '#B7B7CE', border: '#9292A3' },
  '악': { base: '#705746', border: '#5A4538' },
  '페어리': { base: '#D685AD', border: '#AC6A8A' },
  'default': { base: '#f0f0f0', border: '#b0b0b0' }
};

const PokemonName = styled.div`
  font-weight: 700;
  font-size: 1.2em;
  color: #222;
  text-transform: capitalize;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  text-align: center;
  width: 100%;
`;

const PokemonType = styled.div`
  display: inline-block;
  padding: 4px 10px;
  margin: 0 5px 5px 0;
  border-radius: 15px;
  font-size: 0.85em;
  font-weight: 600;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
  text-align: center;

  background-color: ${props => {
    const typeKey = props.$type ? props.$type.trim() : 'default';
    const colors = typeColors[typeKey] || typeColors.default;
    return colors.base;
  }};
  border: 1px solid ${props => {
    const typeKey = props.$type ? props.$type.trim() : 'default';
    const colors = typeColors[typeKey] || typeColors.default;
    return colors.border;
  }};
`;

export default function Detail() {
  const router = useRouter();
  const { pokemonId } = router.query; // URL에서 pokemonId를 가
  const pokemon = useSelector(state => selectPokemonById(Number(pokemonId))); // Redux에서 포켓몬 데이터 가져오기

  if (!pokemon) {
    return <div>포켓몬 정보를 불러오는 중...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row justify-center items-center md:items-start p-4 md:p-8 bg-gray-100/90 rounded-lg shadow-3xl max-w-4xl mx-auto my-8">
      <div className="flex mb-6 md:mb-0 md:mr-8 w-full md:w-1/2 justify-center items-center">
        <FlipCard front={pokemon.front} back={pokemon.back} />
      </div>
      <div className="flex flex-col items-center md:items-start w-full md:w-1/2 text-center md:text-left">
        <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center">
          <PokemonName>{pokemon.name}</PokemonName>
          <FavoriteButton pokemonId={Number(pokemonId)} className="ml-3 text-red-500" />
        </div>
        <div className="mb-4 flex flex-wrap justify-center md:justify-start">
          {pokemon.types && pokemon.types.map((typeInfo, index) => (
            <PokemonType key={index} $type={typeInfo.type.name}>
              {typeInfo.type.name}타입
            </PokemonType>
          ))}
        </div>
        <div className="text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-wrap mb-4">
          {pokemon.description}
        </div>
        <div className="text-gray-500 text-sm md:text-base">
          도감 번호: #{pokemon.id}
        </div>
      </div>
    </div>
  );
}