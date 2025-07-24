import Link from "next/link";
import Card from "../components/Card"; 

// const url = process.env.NEXT_PUBLIC_URL;
const url = "http://localhost:3000";

const getAllPokemon = async () => {
  const pokemonList = await fetch(url + "/api/pokemon", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store", // SSR에서 캐시를 사용하지 않음
  });
  const pokemonData = await pokemonList.json();
  return pokemonData.pokemonData; // 포켓몬 데이터 반환
};

// 서버 컴포넌트에서 데이터 가져오기 
export default async function Main() {
  const pokemonData = await getAllPokemon(); // 서버에서 포켓몬 데이터 받아오기

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center mt-3">
      {pokemonData.map((el) => (
        <Link key={el.id} href={`/detail/${el.id}`}>
          <Card pokemon={el} />
        </Link>
      ))}
    </div>
  );
}