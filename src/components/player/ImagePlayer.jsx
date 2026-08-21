import Background from "./Background"

export default function ImagePlayer({ midia, onFinalizar }) {
  return (
    <div className="imagem-player">
      <Background src={midia.src} />

      <img
        key={midia.id}
        src={midia.src}
        alt={midia.titulo || "Publicidade ConectaFácil"}
        className="imagem-player-principal"
        onError={onFinalizar}
      />
    </div>
  )
}