import { useState, useEffect } from "react"

const useEffectDemo = () => {

    const [produk, setProduk] = useState([]);

    useEffect(() => {
        const getProduk = async () => {
            const response = await fetch('http://127.0.0.1:9000/api/produk', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const res = await response.json();
            const data = await res.data;
            setProduk(data);
        }

        getProduk();
    }, [])


  return (
    <div>
        { produk.map((item) => (
        <ul key={item.id}>
            <li> {item.judul} </li>
            <li> { item.deskripsi }</li>
            <li>{ item.harga }</li>
        </ul>
        )) }

    </div>
  )
}

export default useEffectDemo