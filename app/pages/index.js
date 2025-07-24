"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMultiplePokemonById } from '../RTK/thunk';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Main() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMultiplePokemonById(151));
  }, []);

  return (
    <>
      <h1 className="text-[50px] text-center my-[10px]">포켓몬 도감</h1>
      <nav className="flex gap-[10px] justify-center">
        <Link href="/">메인</Link>
        <Link href="/favorite">나의 포켓볼</Link>
        <div>
          <input
            onChange={(e) => router.push(`/search?pokemon=${e.target.value}`)}
            className="border-b border-[darkgray] px-2 w-30"
          />
          <span>🔍</span>
        </div>
      </nav>
      {/* 여기에 포켓몬 리스트가 렌더링 */}
    </>
  );
}
