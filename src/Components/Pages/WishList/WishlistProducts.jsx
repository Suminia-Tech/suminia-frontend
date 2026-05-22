import { ContinueShopping } from "@/Constant";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Col, Container, Row } from "reactstrap";
import { getAPIData } from "../../../Utils";
import { Btn } from "../../AbstractElements";
import WishlistDataList from "./WishlistDataList";
import Img from "@/Components/Element/Images";

const WishlistProducts = () => {
  const [wishlistData, setWishlistData] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { wishlist } = useSelector((state) => state.AddToCartReducer);

  useEffect(() => {
    const wishlistIds = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (wishlistIds.length > 0) {
       setLoading(true);
      getAPIData(`/api/getwishlist?wishlist=${JSON.stringify(wishlistIds)}`)
        .then((res) => {
          setWishlistData(res.data);
        })
        .catch((error) => {
          console.error("Error fetching wishlist data:", error);
        }) .finally(() => {
          setLoading(false); 
        });
    } else {
      setWishlistData([]);
    }
  }, [wishlist]); 

  return (
    <section className="wish-list-section section-b-space">
      <Container>
        <Row className="justify-content-center">
          {loading ? (
            <>Loading...</>
          ) : (
            <>
              {wishlistData.length > 0 ? (
                <Col sm="12" className="table-responsive">
                  <WishlistDataList wishlistData={wishlistData} />
                </Col>
              ) : (
                <Col sm="3" xs="9" className="mx-auto">
                  <Img src="/assets/images/wishlistEmpty.png" className="img-fluid mb-3" alt="wishlist empty" />
                  <div className="w-100 text-center">
                    <h5 className="text-center mb-3">Wishlist is empty! No products were added to the Wish List</h5>
                    <Btn attrBtn={{ className: "btn-solid-default", onClick: () => router.push("/shop/shop_left_sidebar") }}>{ContinueShopping}</Btn>
                  </div>
                </Col>
              )}
            </>
          )}
        </Row>
      </Container>
    </section>
  );
};

export default WishlistProducts;
