"use client"
import { useDispatch, useSelector } from 'react-redux'
import { favoriteSlice } from '../redux/favoriteSlice'
import styled from 'styled-components';

import notFavoriteImageSrc from '../public/assets/pokeball.svg';
import isFavoriteImageSrc from '../public/assets/pokeball2.svg';

const StyledFavoriteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px; // 버튼 크기 조절
  height: 30px; // 버튼 크기 조절

  img {
    width: 24px; // 이미지 크기 조절
    height: 24px; // 이미지 크기 조절
    object-fit: contain;
    transition: transform 0.2s ease-in-out;
  }
  &:active img {
    transform: scale(0.9); 
  }
`;

//일치하는 Id가 있는지 some을 통해 불리언값을 리턴받는다(하트라면 true, 하트가 아니면 false)
export default function FavoriteButton({pokemonId}) {
  const isFavorite = useSelector(state => state.favorite.some((item) => item === pokemonId))
  const dispatch = useDispatch()

  const favoriteImageSrc = isFavorite ? isFavoriteImageSrc : notFavoriteImageSrc;


  //찜누르기가 되있는지 안되있는지 확인하는 dispatch
  return (
    <StyledFavoriteButton
      onClick={(e) => {
        e.stopPropagation() /* stopPropagation으로 클릭이벤트가 뒤에까지 전달안되게 막아줌 */
        dispatch(isFavorite 
          ? favoriteSlice.actions.removeFromFavorite({pokemonId}) 
          : favoriteSlice.actions.addToFavorite({pokemonId})) /* slice.jsx에서 action.payload.pokemonId로 콕찍어줬기 때문에 객체로 넣어주기위해 {}에 담기 */
      }} 
      >
      {/* {isFavorite ? '`♥´'  : '`♡´'} */}
      <img src={favoriteImageSrc}/>
    </StyledFavoriteButton>
  )
}