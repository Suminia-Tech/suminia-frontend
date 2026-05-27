import { useState } from "react";
import { useSelector } from "react-redux";
import { Btn } from "../../AbstractElements";
import { Input } from "reactstrap";
import { OFF } from "@/Constant";
import DynamicRating from "../../Element/DynamicRating";
import ProductActions from "../Product4ImageContain/ProductActions";
import ShareSocial from "../Product4ImageContain/ShareSocial";

const ProductDetails = ({ singleProduct }) => {
  const [selectedQty, setSelectedQty] = useState(0);
  const [count, setCount] = useState(1);
  const { symbol, currencyValue } = useSelector(
    (state) => state.CurrencyReducer,
  );
  const product = singleProduct?.[0];

  if (!product) return null;

  const quantities = [product.quantity_1, product.quantity_2].filter(Boolean);

  return (
    <div className="cloth-details-size">
      <div className="details-image-concept">
        <h2>{product.name}</h2>
      </div>

      <DynamicRating data={product.ratingStars} customeclass="mt-1" />

      <h3 className="price-detail mt-3" style={{ marginBottom: "8px" }}>
        {symbol}
        {(product.price * currencyValue).toFixed(2)}
        {product.mrp > product.price && (
          <del className="ms-2">
            {symbol}
            {(product.mrp * currencyValue).toFixed(2)}
          </del>
        )}
        {product.discount > 0 && (
          <span className="ms-2">
            {product.discount}% {OFF}
          </span>
        )}
      </h3>

      {product.available && (
        <div className="mt-2">
          <span className="badge badge-theme">En stock</span>
        </div>
      )}

      {product.description && (
        <p className="font-light mb-0">{product.description}</p>
      )}

      {quantities.length > 0 && (
        <div className="border-product mt-3">
          <h6 className="product-title d-block">Presentación</h6>
          <div className="size-box">
            <ul>
              {quantities.map((q, i) => (
                <li
                  key={i}
                  className={selectedQty === i ? "active" : ""}
                  onClick={() => setSelectedQty(i)}
                >
                  <a href="#javascript">{q}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {(product.brand !== "none" ||
        product.category !== "none" ||
        product.type) && (
        <div className="mt-2" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
          {product.brand !== "none" && (
            <span className="font-light">Marca:<strong style={{ fontWeight: '500', marginLeft: '4px' }}>{product.brand}</strong></span>
          )}
          {product.category !== "none" && (
            <span className="font-light">Categoría:<strong style={{ fontWeight: '500', marginLeft: '4px' }}>{product.category}</strong></span>
          )}
          {product.type && product.type !== "none" && (
            <span className="font-light">Tipo:<strong style={{ fontWeight: '500', marginLeft: '4px' }}>{product.type}</strong></span>
          )}
        </div>
      )}

      <div
        className="addeffect-section mt-3"
        style={{ borderTop: "none", paddingTop: 0 }}
      >
        <h6 className="product-title product-title-2 d-block">Cantidad</h6>
        <div className="qty-box">
          <div className="input-group">
            <span className="input-group-prepend">
              <Btn
                attrBtn={{
                  type: "button",
                  className: "quantity-left-minus",
                  onClick: () => setCount((prev) => (prev > 1 ? prev - 1 : 1)),
                }}
              >
                <i className="fas fa-minus"></i>
              </Btn>
            </span>
            <Input
              type="text"
              name="quantity"
              className="form-control input-number"
              value={count}
              readOnly
            />
            <span className="input-group-prepend">
              <Btn
                attrBtn={{
                  type: "button",
                  className: "quantity-right-plus",
                  onClick: () =>
                    setCount((prev) => (prev < 15 ? prev + 1 : 15)),
                }}
              >
                <i className="fas fa-plus"></i>
              </Btn>
            </span>
          </div>
        </div>
      </div>

      <ProductActions singleProduct={singleProduct} />
      <ShareSocial />
    </div>
  );
};

export default ProductDetails;
