export default function Background({ src }) {
  if (!src) return null

  return (
    <div
      className="player-background"
      style={{
        backgroundImage: `url("${src}")`,
      }}
    />
  )
}