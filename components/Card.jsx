"use client";
import { useState, memo } from "react";
import { useRouter } from "next/navigation"; 
import styled from "styled-components";
import FavoriteButton from "./FavoriteButton";

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

const PokemonTypes = styled.div`
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

const CardContainer = styled.section`
  width: 190px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 8px;
  border-radius: 15px;
  background: rgba(240, 240, 240, 0.9);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 3px solid #d0cbcb;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out;

  &:hover {
    transform: translateY(-7px) scale(1.1);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.25), 0 3px 6px rgba(0, 0, 0, 0.12);
  }

  .image-frame {
    width: calc(100% - 16px);
    height: 160px;
    background-color: #f8f8f8;
    border: 2px solid #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
    margin-bottom: 8px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 5px;
  }
`;

const PokemonName = styled.div`
  font-weight: 700;
  font-size: 1.2em;
  color: #222;
  text-transform: capitalize;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  text-align: center;
  width: 100%;
`;

export const Card = memo(({ pokemon }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const router = useRouter();  // Next.js의 useRouter로 라우팅 처리
  const pokemonType = pokemon.types && pokemon.types.length > 0 ? pokemon.types[0].type.name : 'default';

  return (
    <CardContainer onClick={() => router.push(`/detail/${pokemon.id}`)}>
      {isImageLoading ? (
        <div className="w-[120px] h-[120px] leading-[120px] text-center">로딩중...</div>
      ) : null}
      <img
        onLoad={() => setIsImageLoading(false)}
        src={pokemon.front}
        style={{ display: isImageLoading ? 'none' : 'block' }}
      />
      <div className="w-full flex flex-col items-center py-[5px] px-[10px] bg-white/70 rounded-[8px] shadow-[0_-2px_5px_rgba(0,0,0,0.05)]">
        <PokemonTypes $type={pokemonType}>{pokemonType} 타입</PokemonTypes>
        <PokemonName>{pokemon.name}</PokemonName>
        <FavoriteButton pokemonId={pokemon.id} />
      </div>
    </CardContainer>
  );
});
