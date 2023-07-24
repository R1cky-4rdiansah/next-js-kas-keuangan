

const fetchapi = ({ produk }) => {
  return (
    <div><h2>fetchapi</h2>
    { produk.map((item) => (
        <ul key={item.id}>
            <li>{item.judul} - {item.harga}</li>
        </ul>
    )) }
    </div>
    
  )
}

export default fetchapi;

export const getServerSideProps = async() => {
    const response = await fetch('http://127.0.0.1:9000/api/produk');
    const res = await response.json();
    const data = res.data;
    // console.log(data);
    return {
        props: {
            produk: data
        }
    }
}