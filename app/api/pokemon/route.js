import { NextResponse } from 'next/server'; // Response 대신 NextResponse 사용

// 타입 이름 매핑을 위한 전역 변수 (API 요청마다 fetch하지 않도록 최적화)
let typeNamesMap = {};
let isTypeMapLoaded = false; // 타입 맵 로딩 여부 플래그

// 타입 데이터를 미리 로드하는 함수 (콜드 스타트 시 한 번만 실행)
async function loadTypeNamesMap() {
  if (isTypeMapLoaded && Object.keys(typeNamesMap).length > 0) {
    return; // 이미 로드되었으면 다시 로드하지 않음
  }

  try {
    // PokeAPI 타입 목록을 가져옵니다. (Next.js 캐싱: 24시간마다 재검증)
    const allTypesResponse = await fetch('https://pokeapi.co/api/v2/type/', { next: { revalidate: 86400 } });
    if (!allTypesResponse.ok) {
      throw new Error(`타입 목록 불러오기 실패: ${allTypesResponse.status}`);
    }
    const allTypesJson = await allTypesResponse.json();

    await Promise.all(
      allTypesJson.results.map(async (typeEntry) => {
        try {
          // 각 타입의 상세 정보를 가져옵니다. (Next.js 캐싱: 24시간마다 재검증)
          const typeDetailResponse = await fetch(typeEntry.url, { next: { revalidate: 86400 } });
          if (!typeDetailResponse.ok) {
            console.warn(`경고: 타입 '${typeEntry.name}' 상세 정보 불러오기 실패.`);
            typeNamesMap[typeEntry.name] = typeEntry.name; // 실패 시 영어 이름으로 폴백
            return;
          }
          const typeDetailJson = await typeDetailResponse.json();
          const koreanTypeName = typeDetailJson.names.find(nameEntry => nameEntry.language.name === 'ko')?.name;
          typeNamesMap[typeEntry.name] = koreanTypeName || typeEntry.name; // 한국어 없으면 영어
        } catch (innerError) {
          console.warn(`경고: 타입 '${typeEntry.name}' 상세 정보 처리 중 오류 발생. 영어 이름으로 대체합니다.`, innerError.message);
          typeNamesMap[typeEntry.name] = typeEntry.name;
        }
      })
    );
    isTypeMapLoaded = true;
    console.log("타입 맵 로딩 완료:", Object.keys(typeNamesMap).length, "개 타입");
  } catch (err) {
    console.error("오류: API 라우트에서 타입 목록을 불러오지 못했습니다. 포켓몬 타입은 영어로 표시될 수 있습니다.", err.message);
    isTypeMapLoaded = false; // 로딩 실패했음을 표시
  }
}


// 개별 포켓몬 데이터를 가져오는 함수 (주어진 형태 유지)
export const fetchAPI = async (pokemonId) => {
  try {
    // 1. 포켓몬 종(species) 데이터 가져오기 (이름, 설명)
    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`,
      { method: "GET", next: { revalidate: 3600 } } // 캐싱 옵션 추가
    );
    if (!speciesResponse.ok) throw new Error(`Species fetch failed for ID ${pokemonId}`);
    const speciesData = await speciesResponse.json();

    // 2. 포켓몬 일반 데이터 가져오기 (타입, 이미지 URL)
    const pokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`,
      { method: "GET", next: { revalidate: 3600 } } // 캐싱 옵션 추가
    );
    if (!pokemonResponse.ok) throw new Error(`Pokemon data fetch failed for ID ${pokemonId}`);
    const pokemonSubData = await pokemonResponse.json();

    // 한국어 타입 이름 매핑
    const koreanTypes = pokemonSubData.types.map(typeEntry => ({
      slot: typeEntry.slot,
      type: {
        name: typeNamesMap[typeEntry.type.name] || typeEntry.type.name, // 한국어 이름 사용, 없으면 영어
        url: typeEntry.type.url
      }
    }));

    const pokemonData = {
      id: pokemonId,
      // 한국어 이름이 없으면 영어 이름으로 폴백
      name: speciesData.names.find((el) => el.language.name === 'ko')?.name ?? speciesData.name,
      // 한국어 설명이 없으면 기본값, 줄바꿈 문자 제거
      description: speciesData.flavor_text_entries.find((el) => el.language.name === 'ko')?.flavor_text?.replace(/[\n\f]/g, ' ') ?? '설명 없음',
      front: pokemonSubData.sprites.front_default,
      back: pokemonSubData.sprites.back_default,
      types: koreanTypes // 한국어 타입 이름이 적용된 types 배열
    };
    return pokemonData;
  } catch (e) {
    console.error(`오류: 포켓몬 ID ${pokemonId}의 정보를 불러오는 데 실패했습니다.`, e.message);
    // 개별 포켓몬 로딩 실패 시 fallback 데이터 반환
    return {
      id: pokemonId,
      name: '에러',
      description: '이 포켓몬 정보를 불러올 수 없습니다.',
      front: '', // 에러 시 이미지 없음
      back: '',  // 에러 시 이미지 없음
      types: [], // 에러 시 타입 없음
      error: true // 이 객체가 에러 상태임을 나타내는 플래그
    };
  }
};

export async function GET(req) { // req 인자는 사용하지 않지만 형태 유지를 위해 남겨둠
  // API 요청이 들어올 때마다 타입 맵이 로드되었는지 확인하고 필요하면 로드
  if (!isTypeMapLoaded) {
    await loadTypeNamesMap();
  }

  const numberArray = Array.from({ length: 151 }, (_, i) => i + 1); // 1~151까지 배열 생성

  try {
    const response = await Promise.all(numberArray.map((id) => fetchAPI(id)));

    // 요청하신 형식에 맞게 `pokemonData` 필드에 담아 반환
    // `types` 필드와 `error` 플래그도 포함합니다.
    const formattedPokemonData = response.map(pokemon => ({
      id: pokemon.id,
      name: pokemon.name,
      description: pokemon.description,
      front: pokemon.front,
      back: pokemon.back,
      types: pokemon.types,
      error: pokemon.error || false
    }));

    return NextResponse.json({ pokemonData: formattedPokemonData }); // NextResponse 사용

  } catch (e) {
    console.error("API 라우트 전체 데이터 로딩 실패:", e.message);
    return NextResponse.json( // NextResponse 사용
      { message: '데이터 로딩 실패', error: e.message },
      { status: 500 }
    );
  }
}



// export async function GET() {
//   const numberArray = Array.from({ length: 151 }, (_, i) => i + 1); // 1~151까지 배열 생성

//   const fetchAPI = async (pokemonId) => {
//     try {
//       const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
//       const data = await response.json();
      
//       const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
//       const pokemonSubData = await pokemonResponse.json();

//       const pokemonData = {
//         id: pokemonId,
//         name: data.names.find((el) => el.language.name === 'ko')?.name || data.name, // 한국어 이름, 없으면 영어
//         description: data.flavor_text_entries.find((el) => el.language.name === 'ko')?.flavor_text || '',
//         front: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
//         back: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemonId}.png`,
//         types: pokemonSubData.types.map((typeEntry) => ({
//           slot: typeEntry.slot,
//           type: {
//             name: typeEntry.type.name,
//             url: typeEntry.type.url
//           }
//         }))
//       };
//       return pokemonData;
//     } catch (e) {
//       return {
//         id: pokemonId,
//         name: '에러',
//         description: '이 포켓몬 정보를 불러올 수 없습니다.',
//         front: '',
//         back: '',
//         types: [],
//         error: true
//       };
//     }
//   };

//   try {
//     const response = await Promise.all(numberArray.map((id) => fetchAPI(id))); // 모든 포켓몬 데이터 요청
//     return new Response(JSON.stringify({ pokemonData: response }), {
//       headers: { 'Content-Type': 'application/json' }
//     });
//   } catch (e) {
//     return new Response(JSON.stringify({ message: '데이터 로딩 실패' }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }
// }
