import { useState, useEffect } from "react"
import { useRouter } from "next/router" 

const produkId = () => {

    const router = useRouter();

    const { produkId } = router.query;
    const [nama, setNama] = useState("");
    const [harga, setHarga] = useState("");
    const [deskripsi, setDeskripsi] = useState("");

    useEffect(() => {
        const getDetailProduk = async () => {
            const response = await fetch(`http://127.0.0.1:9000/api/detail/${produkId}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const res = await response.json();
            const data = await res.data;

            setNama(data.judul);
            setHarga(data.harga);
            setDeskripsi(data.deskripsi);
        }

        getDetailProduk();
    }, produkId)



  return (
    <div>produkId
        <ul>
            <li>{ nama }</li>
            <li>{ harga }</li>
            <li>{ deskripsi }</li>
        </ul>
    </div>
  )
}

export default produkId