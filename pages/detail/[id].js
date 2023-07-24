import Layout from "../../components/layout"
import axios from "axios"
import Router from "next/router"
import { useState } from "react"
import Swal from "sweetalert2"

export async function getServerSideProps({ params }) {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/detail/${params.id}`)
    const data = response.data;
    const datas = data.data;
    console.log(datas);

    return {
        props: {
            dataProduk: datas
        }
    }
}

const id = ({ dataProduk }) => {

    const [judul, setJudul] = useState(dataProduk.judul);
    const [gambar, setGambar] = useState('');
    const [deskripsi, setDeskripsi] = useState(dataProduk.deskripsi);
    const [harga, setHarga] = useState(dataProduk.harga);

    const [validation, setValidation] = useState({});

    const fileChange = (e) => {
        const dataGambar = e.target.files[0];
        if(!dataGambar.type.match('image.*')){
            setGambar('')
        }
        setGambar(dataGambar);
    }

    const upload = async (e) => {
        e.preventDefault();
        const formdata = new FormData;
        formdata.append('gambar', gambar);
        formdata.append('judul', judul);
        formdata.append('harga', harga);
        formdata.append('deskripsi', deskripsi);

        await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/update/${dataProduk.id}`, formdata)
        .then(() => {
        }).catch((Error) => {
            setValidation(Error.response.data);
        })

        await Swal.fire({
            title: 'Data terupdate',
            text: 'Selamat, data anda telah terupdate',
            icon: 'success',
            showConfirmButton: false,
            timer: 2000
          }).then(() => {
            Router.push('/');
          }) 
    } 

  return (
    <Layout>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className="row" style={{width: '80%'}}>
                <div className="col-md-12">
                    <div className="card border-0 rounded shadow-sm">
                        <div className="card-body">
                            <form onSubmit={ upload }>

                                <div className="form-group mb-3">
                                    <label className="form-label fw-bold">Gambar</label>
                                    <input type="file" className="form-control" onChange={fileChange}/>
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label fw-bold">Judul</label>
                                    <input className="form-control" type="text" value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Masukkan Judul" />
                                </div>
                                {
                                    validation.judul &&
                                        <div className="alert alert-danger">
                                            {validation.judul}
                                        </div>
                                }
                                <div className="form-group mb-3">
                                    <label className="form-label fw-bold">Harga</label>
                                    <input className="form-control" type="number" value={harga} onChange={(e) => setHarga(e.target.value)} placeholder="Masukkan Harga" />
                                </div>
                                {
                                    validation.harga &&
                                        <div className="alert alert-danger">
                                            {validation.harga}
                                        </div>
                                }

                                <div className="form-group mb-3">
                                    <label className="form-label fw-bold">Deskripsi</label>
                                    <textarea className="form-control" rows={3} value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Masukkan Deskripsi" />
                                </div>
                                {
                                    validation.deskripsi &&
                                        <div className="alert alert-danger">
                                            {validation.deskripsi}
                                        </div>
                                }

                                <button className="btn btn-dark border-0 shadow-sm" type="submit">
                                    Update
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default id