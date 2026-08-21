import Player from "../components/Player.jsx"
import Embarques from "../components/Embarques.jsx"

export default function Home() {
  return (
    <div className="tv-home">
      <header className="tv-topo">
        <div className="logo">
          ConectaFácil TV
        </div>

        <div className="status-online">
          🟢 ONLINE
        </div>
      </header>

      <main className="tv-centro">
  <div className="tv-conteudo-principal">
    <div className="tv-area-player">
      <Player />
    </div>

    <aside className="tv-area-embarques">
      <Embarques />
    </aside>
  </div>
</main>

      <footer className="tv-rodape">
        <div>Embarques</div>
        <div>Clima</div>
        <div>Hora</div>
      </footer>
    </div>
  )
}