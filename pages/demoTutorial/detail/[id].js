
// import { useRouter } from "next/router";


const detailProduk = ({ produk }) => {
  
//   const router = useRouter();

//   if(router.isFallback){
//     return(
//         <div>
//             Loading...
//         </div>
//     )
//   }


  return (
    <div><h2>detailProduk</h2>
        <ul>
            <li>No {produk.id}</li>
            <li> { produk.judul } </li>
            <li> { produk.harga } </li>
            <li> { produk.deskripsi } </li>
        </ul>
    </div>
  )
}

// export const getStaticPaths = async () => {
//     const response = await fetch('http://127.0.0.1:9000/api/produk?_limit=1', {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json"
//         }
//     });
//     const res = await response.json();
//     const data = await res.data;
//     const paths = data.map((item) => ({
//         params: { 
//             id : item.id.toString()
//         }
//     }));

//     return {
//         paths,
//         fallback: false
//     }
// }

export const getServerSideProps =  async ({ params }) => {
    const response = await fetch(`http://127.0.0.1:9000/api/detail/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
    });
    const res = await response.json();
    const data = await res.data;

    // if(!data.id){
    //     return {
    //         notFound: true
    //     }
    // }

    return {
        props : {
            produk : data
        }
    }
}

export default detailProduk