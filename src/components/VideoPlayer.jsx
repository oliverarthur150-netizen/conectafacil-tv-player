export default function VideoPlayer({
  midia,
  onFinalizar,
}) {
  return (
    <video
      key={midia.id}
      src={midia.src}
      className="player-midia player-video"
      autoPlay
      muted
      playsInline
      onEnded={onFinalizar}
      onError={onFinalizar}
    />
  )
}