export default function ImagePlayer({
  midia,
  onFinalizar,
}) {
  return (
    <img
      key={midia.id}
      src={midia.src}
      alt={midia.titulo || "Publicidade ConectaFácil"}
      className="player-midia player-imagem"
      onError={onFinalizar}
    />
  )
}