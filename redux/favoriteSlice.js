import { createSlice } from '@reduxjs/toolkit';



export const favoriteSlice = createSlice({
  name: 'favorite',
  initialState: [],
  reducers: {
    addToFavorite(state, action) { state.push(action.payload.pokemonId) },
    removeFromFavorite(state, action) {
      const index = state.indexOf(action.payload.pokemonId) //splice를 사용하기위해서는 index번호가 필요하기 때문에 먼저 확인후 변수에 담기(제거할 요소가 없다면 -1을 리턴)
      if(index !== -1) state.splice(index, 1) //만약 일치하는 index가 있다면 index 번호에서 1개(인덱스자체)만 제거하기
    }
  }
})
