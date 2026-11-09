
import { useEffect, useMemo, useState } from "react";
import { sincronizarTela } from "../services/sincronizacao";
import { CONFIG_TV } from "../config";

const CODIGO_TELA = CONFIG_TV.codigo;
const TEMPO_ATUALIZACAO = CONFIG_TV.intervaloAnuncios;

function formatarHorario(horario) {
  return horario ? String(horario).slice(0, 5) : "--:--";
}

export default function Playlist() {
  const [anuncios, setAnuncios] = useState([]);
  const [embarques, setEmbarques] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [erro, setErro] = useState("");

  const programacao = useMemo(() => {
    const urlsVistas = new Set();

    return anuncios
      .filter((anuncio) => {
        if (!anuncio?.arquivo_url) return false;
        if (urlsVistas.has(anuncio.arquivo_url)) return false;
        urlsVistas.add(anuncio.arquivo_url);
        return true;
      })
      .map((anuncio) => ({
        id: anuncio.id,
        titulo: anuncio.titulo || "Publicidade",
        cliente: anuncio.cliente || "",
        tipo: anuncio.tipo_midia === "video" ? "video" : "imagem",
        src: anuncio.arquivo_url,
        duracao: Number(anuncio.duracao_segundos || 10) * 1000,
      }));
  }, [anuncios]);

  const midiaAtual = programacao[indiceAtual] || null;

  async function carregarProgramacao() {
    try {
      const resultado = await sincronizarTela(CODIGO_TELA);

      setAnuncios(resultado.anuncios || []);
      setEmbarques(resultado.embarques || []);
      setErro("");
    } catch (erroCarregamento) {
      console.error("Erro na sincronização:", erroCarregamento);
      setErro(erroCarregamento?.message || "Erro ao sincronizar.");
    }
  }

  function proximosEmbarques(lista) {
    const agora = new Date();
    const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

    return lista
      .filter((item) => {
        if (!item?.horario || item.ativo === false) return false;

        const [hora, minuto] = String(item.horario)
          .slice(0, 5)
          .split(":")
          .map(Number);

        return hora * 60 + minuto + 3 >= minutosAgora;
      })
      .slice(0, 4);
  }

  function proximaMidia() {
    setIndiceAtual((anterior) =>
      programacao.length <= 1
        ? 0
        : (anterior + 1) % programacao.length
    );
  }

  useEffect(() => {
    carregarProgramacao();

    const intervalo = window.setInterval(
      carregarProgramacao,
      TEMPO_ATUALIZACAO
    );

    return () => window.clearInterval(intervalo);
  }, []);

  useEffect(() => {
    if (!programacao.length || indiceAtual >= programacao.length) {
      setIndiceAtual(0);
    }
  }, [programacao.length, indiceAtual]);

  useEffect(() => {
    if (!midiaAtual || midiaAtual.tipo === "video") return;

    const temporizador = window.setTimeout(
      proximaMidia,
      midiaAtual.duracao || 10000
    );

    return () => window.clearTimeout(temporizador);
  }, [midiaAtual?.id, midiaAtual?.duracao, midiaAtual?.tipo]);

  if (erro && !midiaAtual) {
    return (
      <div className="playlist-vazia">
        <strong>Erro ao carregar</strong>
        <small>{erro}</small>
      </div>
    );
  }

  if (!midiaAtual) {
    return (
      <div className="playlist-vazia">
        <strong>Carregando programação...</strong>
      </div>
    );
  }

  const embarquesVisiveis = proximosEmbarques(embarques);

  return (
    <div className="playlist playlist-com-embarques">
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
              style={{ backgroundImage: `url("${midiaAtual.src}")` }}
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
          <strong>{midiaAtual.titulo}</strong>
          {midiaAtual.cliente && <small>Cliente: {midiaAtual.cliente}</small>}
        </div>
        <div className="playlist-posicao">
          {indiceAtual + 1} de {programacao.length}
        </div>
      </div>

      <section className="faixa-embarques">
        <div className="faixa-embarques-titulo">
          PRÓXIMOS EMBARQUES
        </div>

        <div className="faixa-embarques-lista">
          {embarquesVisiveis.length === 0 ? (
            <div className="faixa-embarques-vazio">
              Nenhum embarque próximo
            </div>
          ) : (
            embarquesVisiveis.map((item) => (
              <div className="faixa-embarque-item" key={item.id}>
                <strong className="faixa-embarque-horario">
                  {formatarHorario(item.horario)}
                </strong>

                <span className="faixa-embarque-rota">
                  {item.origem} → {item.destino}
                </span>

                <span
                  className={`faixa-embarque-status ${
                    item.status === "Cancelado"
                      ? "cancelado"
                      : item.status === "Atrasado"
                      ? "atrasado"
                      : "normal"
                  }`}
                >
                  {item.status || "No horário"}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
