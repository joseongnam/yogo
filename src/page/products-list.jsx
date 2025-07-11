import axios from "axios";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";

function ProductsList() {
  const [title, setTitle] = useState("");
  const [explanation, setExplanation] = useState("");
  const [price, setPrice] = useState("");
  const [discountRate, setDiscountRate] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editingImageFile, setEditingImageFile] = useState(null);
  const [editingProduct, setEditingProduct] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [editingPreviewUrl, setEditingPreviewUrl] = useState(null);
  const [copyId, setCopyId] = useState(null);
  const [copyProduct, setCopyProduct] = useState({});

  const [saleProducts, setSaleProducts] = useState([]); // 특가 상품 목록
  const [salePage, setSalePage] = useState(1); // 특가

  const token = localStorage.getItem("token");

  const fetchProducts = async (pageNum = 1) => {
    try {
      const res = await fetch(`/api/products?page=${pageNum}&limit=10`);
      const data = await res.json();
      setProducts(data.products);
      setTotalPages(Math.ceil(data.total / 10));
    } catch (err) {
      console.error("상품 목록 오류:", err);
    }
  };

  const moveProduct = async (id) => {
    try {
      const res = await axios.post(`/api/products/copy/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSaleProducts((prev) => [...prev, res.data.copiedProduct]);
      console.log("복사 완료");
    } catch (err) {
      console.error("특가 상품 등록 오류:", err);
    }
  };

  const saleProductDelete = async (id) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await axios.delete(`/api/saleProducts/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await res.data;
      if (!res.ok) return alert(result.message);
      alert("삭제 완료!");
    } catch (err) {
      console.error("특가 상품 삭제 실패:", err);
    }
  };

  const fetchSaleProducts = async () => {
    try {
      const res = await fetch("/api/saleProducts");
      const data = await res.json();
      setSaleProducts(data.saleProducts || []);
    } catch (e) {
      console.error("특가 상품 목록 불러오기 실패", e);
    }
  };

  useEffect(() => {
    fetchSaleProducts();
  }, []);

  useEffect(() => {
    fetchProducts(page);
    fetchSaleProducts();
  }, [page]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("이미지를 선택해주세요.");

    try {
      const formData = new FormData();
      formData.append("img", imageFile);

      const uploadRes = await fetch("/api/upload?prefix=products", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.location?.[0];
      if (!imageUrl) return alert("이미지 업로드 실패");

      // 숫자로 변환 후 계산 (int32로 변환)
      const parsedPrice = parseInt(price, 10);
      const parsedDiscountRate = parseInt(discountRate, 10);

      const calculatedDiscountPrice = Math.round(
        parsedPrice * (1 - parsedDiscountRate / 100)
      );

      const saveRes = await fetch("/api/productRegistration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          explanation,
          price: parsedPrice,
          discountRate: parsedDiscountRate,
          discountPrice: calculatedDiscountPrice,
          imageURL: imageUrl,
        }),
      });

      const result = await saveRes.json();
      if (!saveRes.ok) return alert(result.message || "등록 실패");
      alert("등록 완료!");
      setTitle("");
      setExplanation("");
      setPrice("");
      setDiscountRate("");
      setImageFile(null);
      setPreviewUrl(null);
      fetchProducts(page);
    } catch (err) {
      console.error("등록 실패:", err);
    }
  };

  const handleDeleteMultiple = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const keys = products
      .filter((p) => selectedIds.includes(p._id))
      .map((p) => p.imageURL.split(".amazonaws.com/")[1]);

    try {
      const res = await fetch(`/api/delete-multiple`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keys }),
      });

      const result = await res.json();
      if (!res.ok) return alert(result.message);
      alert("삭제 완료!");
      setSelectedIds([]);
      fetchProducts(page);
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  // 수정 시 가격과 할인율 변경되면 할인가 자동 계산
  useEffect(() => {
    if (editingId !== null) {
      const priceNum = parseInt(editingProduct.price, 10);
      const discountRateNum = parseInt(editingProduct.discountRate, 10);

      if (!isNaN(priceNum) && !isNaN(discountRateNum)) {
        const discountPrice = Math.round(
          priceNum * (1 - discountRateNum / 100)
        );
        setEditingProduct((prev) => ({ ...prev, discountPrice }));
      }
    }
  }, [editingProduct.price, editingProduct.discountRate, editingId]);

  const handleUpdate = async () => {
    const formData = new FormData();
    if (editingImageFile) formData.append("img", editingImageFile);

    let imageURL = editingProduct.imageURL;
    if (editingImageFile) {
      const uploadRes = await fetch("/api/upload?prefix=products", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const uploadData = await uploadRes.json();
      imageURL = uploadData.location?.[0] || imageURL;
    }

    const { _id, ...updateFields } = editingProduct;

    // int32 변환 및 할인가 계산
    const parsedPrice = parseInt(updateFields.price, 10);
    const parsedDiscountRate = parseInt(updateFields.discountRate, 10);
    const calculatedDiscountPrice = Math.round(
      parsedPrice * (1 - parsedDiscountRate / 100)
    );

    const res = await fetch(`/api/products/${_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...updateFields,
        price: parsedPrice,
        discountRate: parsedDiscountRate,
        discountPrice: calculatedDiscountPrice,
        imageURL,
      }),
    });

    const result = await res.json();
    if (!res.ok) return alert(result.message);
    alert("수정 완료!");
    setEditingId(null);
    setEditingProduct({});
    setEditingImageFile(null);
    setEditingPreviewUrl(null);
    fetchProducts(page);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleEditingImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditingImageFile(file);
      setEditingPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <h2>상품 등록</h2>
      <form onSubmit={handleSubmit}>
        {previewUrl && <img src={previewUrl} alt="미리보기" width="150" />}
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <input
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="explanation"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
        />
        <input
          placeholder="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          min="0"
        />
        <input
          placeholder="discount rate"
          value={discountRate}
          onChange={(e) => setDiscountRate(e.target.value)}
          type="number"
          min="0"
          max="100"
        />
        <input
          placeholder="할인가 (자동 계산)"
          value={Math.round(
            (parseInt(price, 10) || 0) *
              (1 - (parseInt(discountRate, 10) || 0) / 100)
          )}
          readOnly
        />
        <button type="submit">상품 등록</button>
      </form>

      <h2>상품 목록</h2>
      <button
        onClick={handleDeleteMultiple}
        disabled={selectedIds.length === 0}
      >
        선택 삭제
      </button>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>선택</th>
            <th>이미지</th>
            <th>상품명</th>
            <th>설명</th>
            <th>가격</th>
            <th>할인가</th>
            <th>할인율</th>
            <th>수정</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(p._id)}
                  onChange={() => toggleSelect(p._id)}
                />
              </td>
              <td>
                <img
                  src={
                    editingId === p._id
                      ? editingPreviewUrl || editingProduct.imageURL
                      : p.imageURL
                  }
                  width="80"
                />
                {editingId === p._id && (
                  <input type="file" onChange={handleEditingImageChange} />
                )}
              </td>
              <td>
                {editingId === p._id ? (
                  <input
                    value={editingProduct.title || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        title: e.target.value,
                      })
                    }
                  />
                ) : (
                  p.title
                )}
              </td>
              <td>
                {editingId === p._id ? (
                  <input
                    value={editingProduct.explanation || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        explanation: e.target.value,
                      })
                    }
                  />
                ) : (
                  p.explanation
                )}
              </td>
              <td>
                {editingId === p._id ? (
                  <input
                    value={editingProduct.price || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: e.target.value,
                      })
                    }
                    type="number"
                    min="0"
                  />
                ) : (
                  p.price
                )}
              </td>
              <td>
                {editingId === p._id ? (
                  <input value={editingProduct.discountPrice || ""} readOnly />
                ) : (
                  p.discountPrice
                )}
              </td>
              <td>
                {editingId === p._id ? (
                  <input
                    value={editingProduct.discountRate || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        discountRate: e.target.value,
                      })
                    }
                    type="number"
                    min="0"
                    max="100"
                  />
                ) : (
                  p.discountRate
                )}
              </td>
              <td>
                {editingId === p._id ? (
                  <>
                    <button type="button" onClick={handleUpdate}>
                      저장
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setEditingProduct({});
                        setEditingImageFile(null);
                        setEditingPreviewUrl(null);
                      }}
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(p._id);
                      setEditingProduct({ ...p });
                      setEditingPreviewUrl(null);
                      setEditingImageFile(null);
                    }}
                  >
                    수정
                  </button>
                )}
                <button
                  onClick={() => {
                    moveProduct(p._id);
                  }}
                >
                  특가
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button>이전</button>
        <span>- / - 페이지</span>
        <button>다음</button>
      </div>
      <h2>특가 상품</h2>
      <button>선택 삭제</button>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>선택</th>
            <th>이미지</th>
            <th>상품명</th>
            <th>설명</th>
            <th>가격</th>
            <th>할인가</th>
            <th>할인율</th>
            <th>수정</th>
          </tr>
        </thead>
        <tbody>
          {saleProducts.map((p) => (
            <tr key={p._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(p._id)}
                  onChange={() => toggleSelect(p._id)}
                />
              </td>
              <td>
                <img src={p.imageURL} width="80" />
              </td>
              <td>{p.title}</td>
              <td>{p.explanation}</td>
              <td>{p.price}</td>
              <td>{p.discountPrice}</td>
              <td>{p.discountRate}</td>
              <td>
                <button
                  onClick={() => {
                    saleProductDelete(p._id);
                  }}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button>이전</button>
        <span>- / - 페이지</span>
        <button>다음</button>
      </div>
    </div>
  );
}

export default ProductsList;
