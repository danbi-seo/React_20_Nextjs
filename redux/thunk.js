export async function getPokemonData(maxPokemonId) {
  const typeNamesMap = {};

  // [1] 타입 전체 fetch: 네트워크 오류 및 개별 타입 fetch 실패에 대비한 로직
  try {
    // PokeAPI 타입 목록을 가져옵니다. (캐싱: 24시간)
    const allTypesResponse = await fetch('https://pokeapi.co/api/v2/type/', { next: { revalidate: 86400 } });
    if (!allTypesResponse.ok) {
      throw new Error(`타입 목록 불러오기 실패: ${allTypesResponse.status}`);
    }
    const allTypesJson = await allTypesResponse.json();

    // [2] 개별 타입 상세 정보 fetch 및 한국어 이름 매핑
    await Promise.all(
      allTypesJson.results.map(async (typeEntry) => {
        try {
          // 각 타입의 상세 정보를 가져옵니다. (캐싱: 24시간)
          const typeDetailResponse = await fetch(typeEntry.url, { next: { revalidate: 86400 } });
          if (!typeDetailResponse.ok) {
            throw new Error(`타입 상세 정보 불러오기 실패: ${typeEntry.name}`);
          }
          const typeDetailJson = await typeDetailResponse.json();
          // 한국어 이름이 있으면 사용하고, 없으면 영어 이름으로 폴백
          const koreanTypeName = typeDetailJson.names.find(nameEntry => nameEntry.language.name === 'ko')?.name;
          typeNamesMap[typeEntry.name] = koreanTypeName || typeEntry.name;
        } catch (innerError) {
          console.warn(`경고: 타입 '${typeEntry.name}'의 상세 정보를 불러오지 못했습니다. 영어 이름으로 대체합니다.`, innerError.message);
          typeNamesMap[typeEntry.name] = typeEntry.name; // 개별 타입 로딩 실패 시 영어 이름 폴백
        }
      })
    );
  } catch (err) {
    console.error("오류: 전체 타입 목록을 불러오는 데 실패", err.message);
    // 이 경우 typeNamesMap은 비어있거나 부분적일 수 있으며, 포켓몬 타입은 영어로 표시될 것입니다.
  }

  // 포켓몬 데이터를 가져올 ID 배열 생성 (1부터 maxPokemonId까지)
  const numberArray = Array.from({ length: maxPokemonId }, (_, i) => i + 1);

  // [3] 개별 포켓몬 데이터 fetch 함수 정의
  const fetchAPI = async (pokemonId) => {
    try {
      // 포켓몬 종(species) 데이터 가져오기 (이름, 설명) (캐싱: 1시간)
      const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`, { next: { revalidate: 3600 } });
      if (!speciesResponse.ok) {
        throw new Error(`포켓몬 종 데이터 불러오기 실패: ID ${pokemonId}`);
      }
      const speciesData = await speciesResponse.json();

      // 포켓몬 일반 데이터 가져오기 (타입, 이미지 URL) (캐싱: 1시간)
      const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`, { next: { revalidate: 3600 } });
      if (!pokemonResponse.ok) {
        throw new Error(`포켓몬 데이터 불러오기 실패: ID ${pokemonId}`);
      }
      const pokemonSubData = await pokemonResponse.json();

      // 포켓몬 타입에 한국어 이름 매핑
      const koreanTypes = pokemonSubData.types.map(typeEntry => ({
        slot: typeEntry.slot,
        type: {
          name: typeNamesMap[typeEntry.type.name] || typeEntry.type.name, // 한국어 이름 없으면 영어 이름 사용
          url: typeEntry.type.url
        }
      }));

      // 최종 포켓몬 데이터 객체 구성
      const pokemonData = {
        id: pokemonId,
        // 한국어 이름이 없으면 영어 이름으로 폴백
        name: speciesData.names.find(el => el.language.name === 'ko')?.name ?? speciesData.name,
        // 한국어 설명이 없으면 기본값, 줄바꿈 문자 제거
        description: speciesData.flavor_text_entries.find(el => el.language.name === 'ko')?.flavor_text?.replace(/[\n\f]/g, ' ') ?? '설명 없음',
        front: pokemonSubData.sprites.front_default, // 포켓몬 앞면 이미지 URL
        back: pokemonSubData.sprites.back_default,   // 포켓몬 뒷면 이미지 URL
        types: koreanTypes
      };
      return pokemonData;
    } catch (innerError) {
      console.error(`오류: 포켓몬 ID ${pokemonId}의 정보를 불러오는 데 실패했습니다.`, innerError.message);
      // [4] 개별 포켓몬 로딩 실패 시 fallback 카드 데이터 반환
      return {
        id: pokemonId,
        name: '에러',
        description: '이 포켓몬 정보를 불러올 수 없습니다.',
        front: '', 
        back: '',  
        types: [],
        error: true // 이 객체가 에러 상태인지 아닌지
      };
    }
  };

  // [5] 모든 포켓몬 데이터를 병렬로 가져오기 및 최종 에러 처리
  try {
    const allPokemons = await Promise.all(numberArray.map(el => fetchAPI(el)));
    return allPokemons;
  } catch (err) {
    console.error("오류: 전체 포켓몬 데이터를 불러오는 데 실패했습니다.", err.message);
    // Promise.all 자체가 실패하는 경우는 fetchAPI 내부에서 에러를 던지지 않고
    // fallback 객체를 반환하기 때문에 발생하지 않을 가능성이 높습니다.
    return [];
  }
}