"use client"
import Link from "next/link";

export default function Header() {
  return (
    <header>
      <h1 className='text-[50px] text-center my-[10px]'>포켓몬 도감</h1>
      <nav className='flex gap-[10px] justify-center'>
        <Link href={'/'}>메인</Link>
        <Link href={'/favorite'}>나의포켓볼</Link>
        <div>
          <input onChange={(e) => navigate(`/search?pokemon=${e.target.value}`)} className='border-b border-[darkgray] px-2 w-30'/>
          <span>🔍</span>
        </div>
      </nav>
    </header>
  );
}