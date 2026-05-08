import ContinuousCanvasSequence from '@/components/ContinuousCanvasSequence';

export default function Home() {
  return (
    <main className="bg-black h-screen w-full overflow-hidden">
      <ContinuousCanvasSequence 
        sequences={['seq1', 'seq2', 'seq3', 'seq4', 'seq5', 'seq6', 'seq7', 'seq8', 'seq9', 'seq10', 'seq11', 'seq12']} 
        framesPerSequence={240} 
      >
        <footer className="h-[40svh] md:h-[50vh] flex flex-col items-center justify-center bg-zinc-950 text-white relative z-10 px-4 text-center">
          <h2 className="text-[8vw] sm:text-4xl md:text-6xl font-outfit font-black mb-2 md:mb-4 tracking-tighter text-gray-200 break-words w-full">PAKSARZAMEEN</h2>
          <p className="text-gray-500 font-light tracking-widest text-[10px] md:text-sm uppercase">© 2026 All Rights Reserved</p>
        </footer>
      </ContinuousCanvasSequence>
    </main>
  );
}
