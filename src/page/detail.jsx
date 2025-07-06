import ProductDetail from "../components/product-detail"

function Detail() {

    const [adImages, setAdImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
          try {
            const res = await fetch("/api/image-list?prefix=products/");
            if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
            const data = await res.json();
            setAdImages(data);
          } catch (err) {
            console.error("이미지 불러오기 실패:", err);
          }
        };
        fetchImages();
    }, []);


  return (
    <>
      <div className="background">
        <div className="registration-container">
          <div className="product-img">
            <div className="detail-slide">
                <img src="" alt="상품이미지" />
            </div>
            <div>
                <img src="" alt="" />
                <img src="" alt="" />
                <img src="" alt="" />
                <img src="" alt="" />
                <img src="" alt="" />
                <img src="" alt="" />
            </div>
          </div>
          <ProductDetail/>
        </div>
        <div className="purchase"></div>
      </div>
    </>
  );
}

export default Detail;
