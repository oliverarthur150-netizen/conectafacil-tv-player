export default function Overlay({
  midia,
  indiceAtual,
  total,
}) {
  if (!midia) return null

  return (
    <div className="player-overlay">
      <div className="player-overlay-info">
        <span>EXIBINDO AGORA</span>

        <strong>{midia.titulo}</strong>

        <small>
          Cliente: {midia.cliente || "ConectaFácil"}
        </small>
      </div>

      <div className="player-overlay-posicao">
        {indiceAtual + 1} de {total}
      </div>
    </div>
  )
}