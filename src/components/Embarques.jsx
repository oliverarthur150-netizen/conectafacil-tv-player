import { useEffect, useState } from "react"
import { listarEmbarquesDaTela } from "../services/embarques.service"

const CODIGO_TELA = "LANCHA-01"
const TEMPO_ATUALIZACAO = 10000

function formatarHorario(horario) {
  if (!horario) {
    return "--:--"
  }

  return String(horario).slice(0, 5)
}

export default function Embarques() {
  const [embarques, setEmbarques] = useState([])
  const [erro, setErro] = useState("")
function filtrarProximosEmbarques(lista) {
  const agora = new Date()

  const horaAtualEmMinutos =
    agora.getHours() * 60 + agora.getMinutes()

  return lista
  .filter((embarque) => {
    if (!embarque?.horario) {
      return false
    }

    const [hora, minuto] =
      String(embarque.horario)
        .slice(0, 5)
        .split(":")
        .map(Number)

    const horarioEmMinutos =
      hora * 60 + minuto

    return horarioEmMinutos + 3 >= horaAtualEmMinutos
  })
  .slice(0, 3)
}
  
  async function carregarEmbarques() {
    try {
      const dados =
        await listarEmbarquesDaTela(CODIGO_TELA)

      setEmbarques(
  filtrarProximosEmbarques(dados)
)
      setErro("")
    } catch (error) {
      console.error(
        "Erro ao carregar embarques:",
        error
      )

      setErro(
        error?.message ||
          "Erro ao carregar horários."
      )
    }
  }

  useEffect(() => {
    carregarEmbarques()

    const intervalo = window.setInterval(
      carregarEmbarques,
      TEMPO_ATUALIZACAO
    )

    return () => {
      window.clearInterval(intervalo)
    }
  }, [])

  return (
    <div className="embarques-player">
      <div className="embarques-player-topo">
        <div>
          <span>PRÓXIMOS EMBARQUES</span>
          <strong>Lancha 01</strong>
        </div>

        <div className="embarques-player-status">
          Atualização em tempo real
        </div>
      </div>

      {erro ? (
        <div className="embarques-player-vazio">
          <strong>Não foi possível carregar</strong>
          <small>{erro}</small>
        </div>
      ) : embarques.length === 0 ? (
        <div className="embarques-player-vazio">
          <strong>Nenhum horário cadastrado</strong>
          <small>
            Cadastre os embarques pelo painel.
          </small>
        </div>
      ) : (
        <div className="embarques-player-lista">
          {embarques.map((embarque) => (
            <div
              key={embarque.id}
              className="embarques-player-item"
            >
              <div className="embarques-player-horario">
                {formatarHorario(
                  embarque.horario
                )}
              </div>

              <div className="embarques-player-rota">
                <strong>
                  {embarque.origem}
                </strong>

                <span>→</span>

                <strong>
                  {embarque.destino}
                </strong>
              </div>

              <div
                className={`embarques-player-situacao ${
                  embarque.status ===
                  "Cancelado"
                    ? "cancelado"
                    : embarque.status ===
                        "Atrasado"
                      ? "atrasado"
                      : "normal"
                }`}
              >
                {embarque.status ||
                  "No horário"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}