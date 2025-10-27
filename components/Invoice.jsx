import { useReactToPrint } from "react-to-print";
import React, { useState, useRef } from "react";
import "./Invoice.css";
import { orderDetail as ord } from "./data.js";

function Invoice() {
  const PDFdownload = useRef();

  const generatePDF = useReactToPrint({
    contentRef: PDFdownload,
    documentTitle: `invoice-${ord.orderId}`,
  });

  const [currentVideo, setCurrentVideo] = useState(null);

  const playVideo = (youtubecode) => {
    setCurrentVideo(youtubecode);
  };

  let cartItems = ord.cartItems.map((item) => item);

  let components = cartItems.flatMap((item) => item.components);

  let videos = cartItems.flatMap((item) => item.videos);

  let options = cartItems.flatMap((item) => item.options);

  const uniqueVideos = new Set();
  const uniqueComponents = new Set();
  const uniqueOptions = new Set();

  const video = videos.filter((item) => {
    if (!uniqueVideos.has(item.youTubeCode)) {
      uniqueVideos.add(item.youTubeCode);
      return true;
    }
  });

  const component = components.filter((item) => {
    if (!uniqueComponents.has(item.componentSKU)) {
      uniqueComponents.add(item.componentSKU);
      return true;
    }
  });

  const subTotal = cartItems.reduce((total, item) => {
    const optionTotal = item.options.reduce(
      (sum, opt) => sum + opt.optionPrice,
      0
    );
    const itemSubtotal =
      (item.productPrice * item.quantity)*2 +
      item.protectionPlanProductPrice * item.protectionPlanProduct +
      optionTotal;
    return total + itemSubtotal;
  }, 0);

  return (
    <div className="parent">
      <div ref={PDFdownload} className="container">
        <div className="shipping-status">
          <p className="shipment-detail-key">
            Status : <span className="shipment-detail-value">{ord.status}</span>
          </p>
          <p className="shipment-detail-key">
            Payment Gateway :{" "}
            <span className="shipment-detail-value">{"SQUARE"}</span>
          </p>
        </div>
        <hr />
        <div className="cutomer-details">
          <div className="scustomer-detail">
            <h3>Shipping Details :</h3>
            <p className="customer-name">
              {ord.firstName} {ord.lastName}
            </p>
            <p className="customer-address">
              {ord.shippingStreet} {ord.shippingCity} {ord.shippingState}{" "}
              {ord.shippingCountry} {ord.shippingZipCode}
            </p>
          </div>
          <div className="customer-detail">
            <h3>Billing Details :</h3>
            <p className="customer-name">
              {ord.billingFirstName} {ord.billingLastName}
            </p>
            <p className="customer-address">
              {ord.shippingStreet} {ord.shippingCity} {ord.shippingState}{" "}
              {ord.shippingCountry} {ord.shippingZipCode}
            </p>
            <p className="customer-email">Email : {ord.email}</p>
            <div className="customer-phone">Phone : {ord.phone}</div>
          </div>
        </div>
        <div className="order-summary">
          <h3>Order Summary</h3>
          <hr />
          <div className="order-details">
            <div className="order-detail">
              <p className="title">Order ID</p>
              <p>{ord.orderId}</p>
            </div>
            <div className="order-detail">
              <p className="title">Order Date</p>
              <p>
                {new Date(ord?.dateCreated).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <hr />

          {/* -------------------------------------------------Cart Items----------------------------------------------- */}
          <div className="main-product-border">
            <div className="ordered-product">
              {cartItems.map((item) => (
                <div className="main-product-box">
                  <div className="order-info">
                    <div className="order-image">
                      <img
                        src={`https://tadibrothers.com/_next/image?url=https%3A%2F%2Fpics.tadibrothers.com%2Ffiles%2Fitems%2F850_800%2F${item.defaultImage}&w=1080&q=75`}
                        alt=""
                      />
                    </div>
                    <div className="order-name">
                      <p className="bold-font">{item.productName}</p>
                      <p className="orange-font">Quantity : {item.quantity}</p>
                      {item.protectionPlanProduct > 0 ? (
                        <p className="bold-font green">
                          -Protection Plan: {item.protectionPlanProduct}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="order-total">
                      <div className="unit-price">
                        <p>Unit Price</p>
                        <p className="bold-font">${item.productPrice}</p>
                        {item.protectionPlanProduct > 0 ? (
                          <p className="bold-font green protect-plan-price">
                            ${item.protectionPlanProductPrice}
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="sub-total">
                        <p>Sub Total</p>
                        <p className="bold-font">
                          $
                          {(
                            item.productPrice * item.quantity +
                            item.protectionPlanProductPrice *
                              item.protectionPlanProduct +
                            item.options.reduce(
                              (sum, opt) => sum + opt.optionPrice,
                              0
                            )
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="option-product">
                    {item.options.map((items) => (
                      <div id="option-info">
                        <div className="option-image">
                          <img
                            src={`https://tadibrothers.com/_next/image?url=https%3A%2F%2Fpics.tadibrothers.com%2Ffiles%2Fitems%2F850_800%2F${items.optionDefaultImage}&w=1080&q=75`}
                            alt="optionImage"
                          />
                        </div>
                        <div className="option-detail">
                          <p className="bold-font">{items.optionName}</p>
                          <p className="bold-font">$ {items.optionPrice}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* -------------------------------------------------Option Items--------------------------------------------- */}

          <div className="ordered-product">
            {cartItems.map((item) => (
              <div className="order-info" id="extras">
                <div className="option-image">
                  <img
                    src={`https://tadibrothers.com/_next/image?url=https%3A%2F%2Fpics.tadibrothers.com%2Ffiles%2Fitems%2F850_800%2F${item.defaultImage}&w=1080&q=75`}
                    alt=""
                  />
                </div>
                <div className="option-detail">
                  <p className="bold-font">{item.productName}</p>
                  <p className="orange-font">Quantity : {item.quantity}</p>
                </div>
                <div className="order-total option-detail">
                  <div className="unit-price">
                    <p>Unit Price</p>
                    <p className="bold-font">${item.productPrice}</p>
                  </div>
                  <div className="sub-total">
                    <p>Sub Total</p>
                    <p className="bold-font">
                      ${(item.productPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* -----------------------------------------billing details---------------------------------------- */}

          <div className="billing-information">
            <p>Bill Details</p>
            <div className="bill-amount">
              <p className="bill-head">
                Protection Plan for{" "}
                {ord.protectionPlanOrder +
                  " years @" +
                  ord.protectionPlanOrderPrice +
                  " each :"}
                <span>
                  ${ord.protectionPlanOrder * ord.protectionPlanOrderPrice}
                </span>
              </p>
              <p className="bill-head">
                SubTotal <span>${subTotal}</span>
              </p>
              <p className="bill-head">
                Shipping : <span className="green">${ord.shipping}</span>
              </p>
              <p className="bill-head">
                Coupon : <span className="green">-${ord.discount}</span>
              </p>
            </div>
            <p className="cart-amount font">
              Cart Total Amount
              <span className="font">
                $
                {subTotal +
                  ord.shipping -
                  ord.discount +
                  ord.protectionPlanOrder * ord.protectionPlanOrderPrice}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="btn shipment-detail-value" onClick={generatePDF}>
        Download Receipt
      </div>
      {/*------------------------------------Related Products--------------------------------*/}
      <p className="page-head font">Manuals related to your order :</p>
      <div className="order-related-manual">
        {component.map((item) => (
          <div className="manual-cart">
            <img
              src={`https://tadibrothers.com/_next/image?url=https%3A%2F%2Fpics.tadibrothers.com%2Ffiles%2Fitems%2F850_800%2F${item.componentDefaultImage}&w=1080&q=75`}
              alt=""
            />
            <hr />
            <p className="cart-price">
              ${item.componentPrice} <span>${item.componentListPrice}</span>
            </p>
            <div className="rating-font">
              <p>★★★★★</p>
              <span className="orange-font">
                ({item.componentNumberOfRatings})
              </span>
            </div>
            <p className="cart-title">{item.componentName}</p>
            <p className="purple-font">{item.componentSKU}</p>
          </div>
        ))}
      </div>
      {/*------------------------------------Related Videos--------------------------------*/}
      <p className="page-head font">Videos related to your order :</p>
      <div className="order-related-video">
        {video.map((item) => (
          <div className="video-cart">
            <div className="video-wrapper">
              {currentVideo == item.youTubeCode ? (
                <iframe
                  src={`https://www.youtube.com/embed/${item.youTubeCode}?autoplay=1&mute=1&rel=0&modestbranding=1&showinfo=0&controls=1`}
                  allowFullScreen
                  className="youtube-video"
                  frameBorder={0}
                ></iframe>
              ) : (
                <img
                  src={`https://i.ytimg.com/vi/${item.youTubeCode}/maxresdefault.jpg`}
                  alt="Image Not Found"
                  onClick={() => {
                    playVideo(item.youTubeCode);
                  }}
                  className="thumbnail"
                />
              )}
            </div>
            <hr />
            <p className="cart-title">{item.title}</p>
            <div className="rating-font">
              <p>★★★★★</p>
              <span className="orange-font">
                ({item.componentNumberOfRatings})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Invoice;
