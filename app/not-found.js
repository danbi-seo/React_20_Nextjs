import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 text-gray-800 p-8">
      <div className="flex flex-col items-center justify-center">
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
          alt="Pokémon"
          className="w-36 h-36 mb-6 animate-bounce"
        />
        <h1 className="text-5xl font-extrabold text-white mb-4 animate__animated animate__fadeIn animate__delay-1s">
          이런, 페이지를 찾을 수 없어요!
        </h1>
        <p className="text-xl text-white mb-6">
          이 포켓몬은 도감을 탈출한 것 같아요! 😱
        </p>
        <Link
          href="/"
          className="px-8 py-4 bg-yellow-400 text-white text-xl font-semibold rounded-full shadow-lg hover:bg-yellow-500 transition-all duration-300"
        >
          포켓몬 도감으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
