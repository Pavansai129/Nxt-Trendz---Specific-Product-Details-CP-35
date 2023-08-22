import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'
// Write your code here

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    itemCount: 1,
    productDetails: [],
    similarProducts: [],
    apiStatus: apiStatusConstants.initial,
    errorMsg: '',
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedProductDetails = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        style: data.style,
        brand: data.brand,
        description: data.description,
        availability: data.availability,
        totalReviews: data.total_reviews,
        price: data.price,
        rating: data.rating,
      }
      const similarProductsData = data.similar_products
      const updatedSimilarProducts = similarProductsData.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        title: each.title,
        style: each.style,
        price: each.price,
        description: each.description,
        brand: each.brand,
        totalReviews: each.total_reviews,
        rating: each.rating,
        availability: each.availability,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        productDetails: updatedProductDetails,
        similarProducts: updatedSimilarProducts,
      })
    } else if (response.status === 404) {
      this.setState({
        errorMsg: data.error_msg,
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  increaseItemCount = () => {
    this.setState(prevState => ({itemCount: prevState.itemCount + 1}))
  }

  decreaseItemCount = () => {
    const {itemCount} = this.state
    if (itemCount > 1) {
      this.setState(prevState => ({itemCount: prevState.itemCount - 1}))
    }
    this.setState(prevState => ({itemCount: prevState.itemCount}))
  }

  renderSimilarProducts = () => {
    const {similarProducts} = this.state
    return (
      <ul>
        {similarProducts.map(eachProduct => (
          <SimilarProductItem key={eachProduct.id} eachProduct={eachProduct} />
        ))}
      </ul>
    )
  }

  renderSuccessView = () => {
    const {productDetails, itemCount} = this.state
    const {
      id,
      imageUrl,
      title,
      style,
      brand,
      description,
      availability,
      totalReviews,
      price,
      rating,
    } = productDetails
    return (
      <>
        <Header />
        <div>
          <div className="product-details-container">
            <div className="product-image">
              <img src={imageUrl} alt="product" className="product-image" />
            </div>
            <div className="details-container">
              <h1>{title}</h1>
              <p>Rs {price}/-</p>
              <div className="rating-container">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
                <p>{totalReviews} Reviews</p>
              </div>
              <p className="description">{description}</p>
              <p>Available: {availability}</p>
              <p>Brand: {brand}</p>
              <hr className="line" />
              <div className="item-count-container">
                <button
                  type="button"
                  data-testid="plus"
                  onClick={this.increaseItemCount}
                >
                  <BsPlusSquare />
                </button>
                <p>{itemCount}</p>
                <button
                  type="button"
                  data-testid="minus"
                  onClick={this.decreaseItemCount}
                >
                  <BsDashSquare />
                </button>
              </div>
              <button type="button">Add to Cart</button>
            </div>
          </div>
          {this.renderSimilarProducts()}
        </div>
      </>
    )
  }

  renderFailureView = () => {
    const {errorMsg} = this.state
    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="error-image"
        />
        <h1>{errorMsg}</h1>
        <Link to="/products">
          <button type="button">Continue Shopping</button>
        </Link>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={50} width={50} />
    </div>
  )

  renderProductItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return <div>{this.renderProductItemDetails()}</div>
  }
}

export default ProductItemDetails
