import { useRouter } from "next/router"

const demo = () => {

  const router = useRouter();
  const {demo = []} = router.query;
  console.log(demo);

  return (
    <div>parameter slash : {demo[0]}</div>
  )
}

export default demo