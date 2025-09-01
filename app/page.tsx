'use client';
import axios from "axios";
import React, { useState } from "react";

export default function Home() {

  const [productData, setproductData] = useState({ productName: "", productDes: "", productList: [] })
  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await axios.post("/api/products", { productName: productData.productName, productDesc: productData.productDes })
    console.log(res.data);
  }

  async function handleFetchProducts() {
    const res = await axios.get("/api/products");
    setproductData({ ...productData, productList: res.data.data });
    // console.log(res.data.data.map((data: any) => { return { _id: data._id, desc: data.description, gender: data?.gender ?? "", title: data.title } }));
  }

  return (
    <>
      <div>
        <form onSubmit={(e) => handleFormSubmit(e)}>
          <div>
            Product name - <input type="text" value={productData.productName} onChange={(e) => { setproductData({ ...productData, productName: e.target.value }) }} required />
          </div>
          <br />
          <div>
            ProductDesc - <input type="text" value={productData.productDes} onChange={(e) => { setproductData({ ...productData, productDes: e.target.value }) }} required />
          </div>
          <div>
            <button type="submit">
              Submit
            </button>
          </div>
        </form>
        <button type="button" onClick={handleFetchProducts}>
          Fetch Products
        </button>
        <div className="flex flex-row">
          {
            productData?.productList?.map((data, index) => {
              return (
                <div key={index}>
                  <div>{data?.title}</div>
                  <div><img src={data.image} width={150} /></div>
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  );
}
