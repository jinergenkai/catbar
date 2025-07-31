// Three.js rendering cho sprite mèo
export default function CatSprite() {
  return (<img
    src="/assets/study_cat.png"
    alt="Cat Sprite"
    style={{
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
      maxWidth: '100%',
      height: '200%',
      maxHeight: '80px',
      objectFit: 'contain',
      margin: 0,
      padding: 0
    }}
  />
  )
}