import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text3D, Center, Sparkles } from '@react-three/drei'
import Navbar from '../components/Navbar'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      <Navbar />
      <div className="h-[60vh] relative">
        <Canvas camera={{ position: [0, 0, 6] }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} />
          <Center>
            <Text3D font="/fonts/helvetiker_regular.typeface.json" size={0.7} height={0.1}>
              AI Marketing Suite
              <meshStandardMaterial color="#a855f7" emissive="#3b0764" />
            </Text3D>
          </Center>
          <Sparkles count={500} scale={[10,10,10]} size={0.5} speed={0.5} />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
        </Canvas>
      </div>
      <div className="text-center py-16 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold">Dominate Social Media with AI</h1>
        <p className="text-xl mt-4 max-w-2xl mx-auto">Keyword finder, YouTube scripts, Instagram captions, TikTok hooks, thumbnails & content calendar – all in one place.</p>
        <div className="mt-8 space-x-4">
          <Link href="/signup" className="bg-purple-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-700">Start Free – Get 10 Coins</Link>
          <Link href="/pricing" className="bg-gray-800 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-700">View Pricing</Link>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto py-12 px-4">
        {['Keyword Finder', 'YouTube Script', 'Instagram Captions', 'TikTok Hooks', 'Thumbnail Creator', 'Content Calendar'].map(tool => (
          <div key={tool} className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold">{tool}</h3>
            <p className="mt-2 text-gray-300">Generate high-quality {tool.toLowerCase()} in seconds.</p>
          </div>
        ))}
      </div>
    </div>
  )
  }
