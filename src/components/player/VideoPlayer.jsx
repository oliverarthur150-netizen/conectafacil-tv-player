export default function VideoPlayer({ midia, onFinalizar }) {
  return (
    <video
      key={midia.id}
      src={midia.src}
      className="video-player-principal"
      autoPlay
      muted
      playsInline
      onEnded={onFinalizar}
      onError={onFinalizar}
    />
  )
}