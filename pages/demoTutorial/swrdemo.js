import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json())

const swrdemo = () => {

    const { data: produk, error: isError, isLoading } = useSWR('http://127.0.0.1:9000/api/produk', fetcher);

    if(isError) return <div> Error Failed to Load Page </div>;
    if(isLoading) return <div> Loading... </div>;
    const arr = Object.values(produk);

  return (
    <div>
        {
            arr[2].map((val, i) => (
                <ul key={i}>
                    <li>No {i+1}</li>
                    <li>{ val.judul } - { val.harga }</li>
                    <li>{ val.deskripsi }</li>
                </ul>
            ))
        }
    </div>
  )
}

export default swrdemo