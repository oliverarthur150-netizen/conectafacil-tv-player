import { useEffect, useMemo, useState } from "react"
import { listarAnunciosDaTela } from "../services/anuncios.service"

const CODIGO_TELA = "LANCHA-01"
const TEMPO_ATUALIZACAO = 3000

export default function Playlist() {
  const [anuncios, setAnuncios] = useState([])
  const [indiceAtual, setIndiceAtual] = useState(0)
  const [erro, setErro] = useState("")

 const programacao = useMemo(() => {
  const urlsVistas = new Set()

  return anuncios
    .filter((anuncio) => {
      if (!anuncio?.arquivo_url) {
        return false
      }

      if (urlsVistas.has(anuncio.arquivo_url)) {
        return false
      }

      urlsVistas.add(anuncio.arquivo_url)
      return true
    })
    .map((anuncio) => ({
      id: anuncio.id,
      titulo: anuncio.titulo || "Publicidade",
      cliente: anuncio.cliente || "",
      tipo:
        anuncio.tipo_midia === "video"
          ? "video"
          : "imagem",
      src: anuncio.arquivo_url,
      duracao:
        Number(anuncio.duracao_segundos || 10) *
        1000,
    }))
}, [anuncios])
      

  const midiaAtual =
    programacao[indiceAtual] || null

  async function carregarProgramacao() {
    try {
      const resultado =
        await listarAnunciosDaTela(CODIGO_TELA)

      setAnuncios(resultado.anuncios || [])
      setErro("")
    } catch (erroCarregamento) {
      console.error(
        "Erro ao carregar anúncios:",
        erroCarregamento
      )

      setErro(
        erroCarregamento?.message ||
          "Erro ao carregar programação."
      )
    }
  }

  function proximaMidia() {
    setIndiceAtual((indiceAnterior) => {
      if (programacao.length <= 1) {
        return 0
      }

      return (
        (indiceAnterior + 1) %
        programacao.length
      )
    })
  }

  useEffect(() => {
    carregarProgramacao()

    const intervalo = window.setInterval(
      carregarProgramacao,
      TEMPO_ATUALIZACAO
    )

    return () => {
      window.clearInterval(intervalo)
    }
  }, [])

  useEffect(() => {
    if (programacao.length === 0) {
      setIndiceAtual(0)
      return
    }

    if (indiceAtual >= programacao.length) {
      setIndiceAtual(0)
    }
  }, [programacao.length, indiceAtual])

 useEffect(() => {
  if (!midiaAtual) return

  if (midiaAtual.tipo === "video") {
    return
  }

  const temporizador = window.setTimeout(() => {
    proximaMidia()
  }, midiaAtual.duracao || 10000)

  return () => {
    window.clearTimeout(temporizador)
  }
}, [
  midiaAtual?.id,
  midiaAtual?.duracao,
  midiaAtual?.tipo,
  programacao.length,
])

  if (erro && !midiaAtual) {
    return (
      <div className="playlist-vazia">
        <strong>Erro ao carregar</strong>
        <small>{erro}</small>
      </div>
    )
  }

  if (!midiaAtual) {
    return (
      <div className="playlist-vazia">
        <strong>Carregando programação...</strong>
      </div>
    )
  }

  return (
    <div className="playlist">
      <div className="playlist-area-midia">
        {midiaAtual.tipo === "video" ? (
          <video
            key={midiaAtual.id}
            src={midiaAtual.src}
            className="player-midia player-video"
            autoPlay
            muted
            playsInline
            onEnded={proximaMidia}
            onError={proximaMidia}
          />
        ) : (
          <div className="imagem-player">
  <div
    className="player-background"
    style={{
      backgroundImage: `url("${midiaAtual.src}")`,
    }}
  />

  <img
    key={midiaAtual.id}
    src={midiaAtual.src}
    alt={midiaAtual.titulo}
    className="imagem-player-principal"
    onError={proximaMidia}
  />
</div>
        )}
      </div>

      <div className="playlist-informacoes">
        <div>
          <span>EXIBINDO AGORA</span>

          <strong>
            {midiaAtual.titulo}
          </strong>

          {midiaAtual.cliente && (
            <small>
              Cliente: {midiaAtual.cliente}
            </small>
          )}
        </div>

        <div className="playlist-posicao">
          {indiceAtual + 1} de{" "}
          {programacao.length}
        </div>
      </div>
    </div>
  )
}