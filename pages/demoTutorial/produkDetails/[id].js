import useSWR from 'swr';
import { useRouter } from 'next/router';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const id = () => {

    const router = useRouter();
    const { id } = router.query;

    const { data: produk, isLoading, error } = useSWR(`http://127.0.0.1:9000/api/detail/${id}`, fetcher);

    if(isLoading) return <div>Loading...</div>
    if(error) return <div>Error</div>
    console.log(produk);

  return (
    <div>id</div>
  )
}

export default id