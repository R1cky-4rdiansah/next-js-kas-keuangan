import Layout from "../../components/layout";
import axios from "axios";
import Router, { useRouter } from "next/router";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import ModalEdit from "../modalEdit";
import ModalSimpan from "../modalSimpan";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { FaTrashAlt } from 'react-icons/fa';
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';

export async function getServerSideProps(ctx) {

  const paramsId = ctx.params.id;
  const token = ctx.req.cookies.token;

  if(token){
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/produk?page=${paramsId}`);

    const data = await response.data.data.data;
    const pages = await response.data.data.last_page;
    const page = await response.data.data.current_page;
    return{
      props: {
        dataProduk : data,
        pages,
        page
      }
    }
  }

  if(!token){
      return{
        redirect: {
          destination : '/login'
        }
      }
  }
}

const index = ({ dataProduk, pages, page }) => {

  const [selectedProducts, setSelectedProducts] = useState(null);
  const [total, settotal] = useState(0);

  const [allData, setAllData] = useState(dataProduk);

  useEffect(() => {

    setAllData(dataProduk);

  }, [dataProduk])

  //paginating
  const [step, setStep] = useState(1);
  const [ArrayPage, setPage] = useState([]);
    if(step <= parseInt(pages)){
      setStep(step+1);
      setPage([...ArrayPage, step ]);
    }
  const paginate = (id) => {
    Router.push(`/daftarProduk/${id}`)
    }

  //search
  const [cari, setCari] = useState('');
  const handleChange = (e) => {
    setCari(e.target.value);
  }
  const cariData = (array) => {
    return array.filter((el) => 
    el.judul.toLowerCase().includes(cari) || 
    el.harga.toString().toLowerCase().includes(cari) ||
    el.deskripsi.toLowerCase().includes(cari));
  }
  const newData = cariData(allData);

  //Rupiahs format
  const RupiahFormat = (value) =>{
    return value.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });
  }

  const Rupiahs = (dataProduk) => {
    return RupiahFormat(dataProduk.harga)
  }


  //gambar
  const showImage = (data) => {
    return (
      <div>
      <a href={`${process.env.NEXT_PUBLIC_API_BACKEND}/produk/${data.gambar}`} target="_blank">
          <img src={`${process.env.NEXT_PUBLIC_API_BACKEND}/produk/${data.gambar}`} width="150" className="rounded-3"/>    
      </a>   
    </div>
    )
  }

  const funcDataCheck = () => {
    const totalLl = selectedProducts.reduce((a, item) => 
      a + item.harga, 0
    )
    settotal(totalLl);
  }

  console.log(total);

  //Hapus Produk
  const hapusProduk = async (idProduk) => {      
    const tokenHapus = Cookies.get('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenHapus}`;

      await Swal.fire({
          title: 'Apakah anda yakin?',
          text: "Anda yakin ingin menghapus data ini!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Hapus!'
        }).then((result) => {
          if (result.isConfirmed) {
              axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/hapus/${idProduk}`);
              refreshPage();
          }
        });
  }
  const router = useRouter();
  const refreshPage = () => {
        Swal.fire({
            title: 'Data Terhapus',
            text: 'Selamat, data anda telah terhapus', 
            icon: 'success', 
            showConfirmButton: false,
            timer: 2000
        }).then(() => {
            router.replace(router.asPath);
        });
    }

  return (
    <Layout handleChange={handleChange}>
        <div className="container-fluid m-0" style={{paddingTop: '10px', paddingBottom: '10px'}}>
          <div className="row m-0 p-0" style={{width: '100%'}}>
              <div className="col-md-12 m-0 p-0" style={{width: '100%'}}>
                  <div className="card border-0 shadow-sm rounded-3">
                      <div className="card-body">
                          {/* <Link href="/simpan">
                              <button className="btn btn-dark border-0 shadow-sm mb-3">TAMBAH</button>
                          </Link> */}
                          <div className="d-flex justify-content-between align-items-center">
                          <ModalSimpan />
                          <form className="d-flex">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={handleChange} />
                          </form>
                          </div>
                          <DataTable className=" mt-3" value={newData} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }} let-i="rowIndex">
                            <Column header="No" style={{ width: '10%' }} body={(data, options) => options.rowIndex + 1}></Column>
                            <Column header="Gambar" body={showImage} ></Column>
                            <Column field="judul" header="Judul" style={{ width: '25%' }}></Column>
                            <Column header="Harga" style={{ width: '25%' }} body={Rupiahs}  ></Column>
                            <Column field="deskripsi" header="Deskripsi" style={{ width: '40%' }}></Column>
                          </DataTable>
                          {/* <div className="card">
                            <DataTable value={dataProduk} selectionMode={'checkbox'} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)} dataKey="id" tableStyle={{ minWidth: '50rem' }}>
                                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                                <Column field="judul" header="Judul" style={{ width: '25%' }}></Column>
                                <Column header="Harga" style={{ width: '25%' }} body={Rupiahs}  ></Column>
                                <Column field="deskripsi" header="Deskripsi" style={{ width: '40%' }}></Column>
                            </DataTable>
                        </div> */}
                        {/* <Button variant="dark" style={{color: 'white'}} onClick={funcDataCheck}>
                    cek
                </Button> */}
                          {/* <table className="table table-hover mb-0 mt-3">
                              <thead>
                                  <tr className=" text-center align-middle table-dark">
                                      <th>No</th>
                                      <th scope="col">Gambar</th>
                                      <th scope="col">Judul</th>
                                      <th scope="col">Harga</th>
                                      <th scope="col">Deskripsi</th>
                                      <th scope="col">Aksi</th>
                                  </tr>
                              </thead>
                              <tbody>
                              { newData.map((item, i) => (
                                  <tr key={ i }>
                                      <td className="text-center">{ i+1 }</td>
                                      <td className="text-center">
                                        <a href={`${process.env.NEXT_PUBLIC_API_BACKEND}/produk/${item.gambar}`} target="_blank">
                                            <img src={`${process.env.NEXT_PUBLIC_API_BACKEND}/produk/${item.gambar}`} width="150" className="rounded-3"/>    
                                        </a>                                          
                                      </td>
                                      <td>{ item.judul }</td>
                                      <td>{ USDollar.format(item.harga) }</td>
                                      <td>{ item.deskripsi }</td>
                                      <td className="text-center">
                                        <div className=" d-flex justify-content-around align-items-center">
                                        <ModalEdit item={item} page={page} /> */}

                                        {/* <button className="btn btn-sm btn-danger border-0 shadow-sm mb-3">Hapus</button> */}
                                        {/* <Button style={{margin: '0 4px'}} size="sm" onClick={() => hapusProduk(item.id)} variant="danger">
                                        <FaTrashAlt />
                                        </Button>
                                        </div> */}
                                        {/* <Link href={`/detail/${item.id}`}>
                                            <button className="btn text-white btn-sm btn-warning border-0 shadow-sm mb-3 me-3">Edit</button>
                                        </Link> */}
                                      {/* </td>
                                  </tr>
                              )) }
                              </tbody>
                          </table>   */}
                          {/* <nav aria-label="Page navigation example" className=" mt-5">
                            <ul className="pagination justify-content-end">
                                {
                                    page == 1 ? (
                                        <li className={ page == 1 ? 'page-item disabled' : 'page-item' }>
                                        <a style={{cursor: 'pointer'}} className="page-link" aria-disabled="true">Previous</a>
                                        </li>
                                    ) : (
                                        <li onClick={() => paginate(page - 1)} className={ page == 1 ? 'page-item disabled' : 'page-item' }>
                                        <a style={{cursor: 'pointer'}} className="page-link" aria-disabled="true">Previous</a>
                                        </li>
                                    )
                                }
                                {
                                    ArrayPage.map((item) => (
                                        <li key={item} onClick={() => paginate(item)} className={page == item ? 'page-item active' : 'page-item'} style={{cursor: 'pointer'}} ><a className="page-link">{ item }</a></li>
                                    ))
                                }
                                {
                                    page == pages ? (
                                        <li className={ page == pages ? 'page-item disabled' : 'page-item' }>
                                        <a style={{cursor: 'pointer'}} className="page-link">Next</a>
                                        </li>
                                    ) : (
                                        <li onClick={() => paginate(page + 1)} className={ page == pages ? 'page-item disabled' : 'page-item' }>
                                        <a style={{cursor: 'pointer'}} className="page-link">Next</a>
                                        </li>
                                    )
                                }
                            </ul>
                          </nav> */}
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </Layout>
  )
}

export default index