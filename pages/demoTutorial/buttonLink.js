import { useRouter } from "next/router"

const buttonLink = () => {

    const router = useRouter();

    const move = () => {
        console.log('halaman berpindah');
        router.push('/about');
    }

  return (
    <div>
        <button onClick={move}>Move About</button>
    </div>
  )
}

export default buttonLink