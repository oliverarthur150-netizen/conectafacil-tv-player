import { useEffect, useState } from "react"
import ImagePlayer from "./ImagePlayer"
import VideoPlayer from "./VideoPlayer"
import Overlay from "./Overlay"

const PROGRAMACAO_INICIAL = [
  {
    id: 1,
    tipo: "imagem",
    src: "/anuncio1.jpg",
    titulo: "Wi-Fi Turbo",
    cliente: "ConectaFácil",
    duracao: 10000,
  },
]

export default function Playlist() {
  const [indiceAtual, setIndiceAtual] = useState(0)

  const midiaAtual = PROGRAMACAO_INICIAL[indiceAtual] || null

  function proximaMidia() {
    setIndiceAtual((anterior) =>
      (anterior + 1) % PROGRAMACAO_INICIAL.length
    )
  }

  useEffect(() => {
    if (!midiaAtual) return

    if (midiaAtual.tipo === "imagem") {
      const timer = setTimeout(
        proximaMidia,
        midiaAtual.duracao
      )

      return () => clearTimeout(timer)
    }
  }, [midiaAtual])

  if (!midiaAtual) {
    return null
  }

  return (
    <div className="playlist-v2">
      <div className="playlist-v2-midia">
        {midiaAtual.tipo === "imagem" ? (
          <ImagePlayer
            midia={midiaAtual}
            onFinalizar={proximaMidia}
          />
        ) : (
          <VideoPlayer
            midia={midiaAtual}
            onFinalizar={proximaMidia}
          />
        )}
      </div>

      <Overlay
        midia={midiaAtual}
        indiceAtual={indiceAtual}
        total={PROGRAMACAO_INICIAL.length}
      />
    </div>
  )
}