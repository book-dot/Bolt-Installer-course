
export default function Home() {
  return (
    <main style={{minHeight:"100vh",display:"grid",placeItems:"center"}}>
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Bolt Installer Course Demo</h1>
        <p className="text-gray-600 mb-4">Go to the course page to start.</p>
        <a href="/installers/course" className="inline-block px-4 py-2 rounded-2xl bg-black text-white">Open Course</a>
      </div>
    </main>
  );
}
