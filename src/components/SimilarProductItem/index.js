import './index.css'
// Write your code here
const SimilarProductItem = props => {
  const {eachProduct} = props
  const {
    id,
    imageUrl,
    title,
    price,
    rating,
    style,
    description,
    brand,
    availability,
    totalReviews,
  } = eachProduct
  return (
    <li key={eachProduct.id}>
      <img src={imageUrl} alt={`similar product ${title}`} />
      <h1>{title}</h1>
      <p>By {brand}</p>
      <p>Price {price}/-</p>
      <div className="rating-container">
        <p>{rating}</p>
        <img
          src="https://assets.ccbp.in/frontend/react-js/star-img.png"
          alt="star"
          className="star"
        />
      </div>
    </li>
  )
}

export default SimilarProductItem
