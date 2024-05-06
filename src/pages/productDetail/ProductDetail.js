import React, { useEffect, useState } from "react";
import "./ProductDetail.scss";
import { useParams } from "react-router-dom";
import { axiosClient } from "../../utils/axiosClient";
import Loader from '../../components/loader/Loader'
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/cartSlice";
function ProductDetail() {

  const params = useParams();
  const [product,setProduct] = useState(null);
  const dispatch = useDispatch();

  const cart = useSelector(state => state.cartReducer.cart);
  const quantity = cart.find(item => item.key === params.productId)?.quantity || 0;

  async function fetchData(){
    const ProductsResponse = await axiosClient.get(`/products?filters[key][$eq]=${params.productId}&populate=*`);
    if(ProductsResponse.data.data.length>0){
      setProduct(ProductsResponse.data.data[0]);
    }

  }

  useEffect(()=>{
    setProduct(null);
    fetchData();
  },[params])

  if(!product){
    return <Loader />;
  }

  return (
    <div className="ProductDetail">
      <div className="container">
        <div className="product-layout">
          <div className="product-img center">
            <div className="img-container">
              <img src={product?.attributes.image.data.attributes.url} alt="product img" />
            </div>
          </div>
          <div className="product-info">
            <h1 className="heading">
              {product?.attributes.title}
            </h1>
            <h3 className="price">₹ {product.attributes.price}</h3>
            <p className="description">
              {product.attributes.desc}
            </p>
            <div className="cart-options">
              <div className="quantity-selector">
                <span className="btn decrement" onClick={()=> dispatch(removeFromCart(product))}>-</span>
                <span className="quantity">{quantity}</span>
                <span className="btn increment"
                onClick={()=> dispatch(addToCart(product))}>+</span>
              </div>
              <button className="btn-primary add-to-cart" onClick={()=> dispatch(addToCart(product))}>ADD TO CART</button>
            </div>
            <div className="return-policy">
              <ul>
                <li>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                </li>
                <li>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Maiores, fugit.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
