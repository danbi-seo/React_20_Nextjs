import { createSlice } from '@reduxjs/toolkit';
import { fetchMultiplePokemonById } from './thunk'; 

export const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState: {
    data: [],
    loading: true,
  },
  reducers: {},  // 동기적 상태 변경이 필요 없다면 빈 reducers 사용
  extraReducers: (builder) => {
    builder
      .addCase(fetchMultiplePokemonById.pending, (state) => {
        state.loading = true; // 비동기 작업이 진행 중일 때 로딩 상태
      })
      .addCase(fetchMultiplePokemonById.rejected, (state) => {
        state.loading = false; // 실패 시 로딩을 종료
      })
      .addCase(fetchMultiplePokemonById.fulfilled, (state, action) => {
        state.loading = false; // 성공 시 로딩을 종료하고, 포켓몬 데이터 저장
        state.data = action.payload;
      });
  }
});

export default pokemonSlice.reducer;
