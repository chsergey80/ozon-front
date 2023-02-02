import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { AppDispatch } from "../store/store"
import { getSingleProduct } from "../store/features/product/thunks"
import { selectProducts } from "../store/features/product/selectors"
import { VerticalScroll } from "../components/VerticalScroll"
import defaultImg from "./../assets/images/ozon-logo.png"
import { setActiveImage } from "../store/features/product/productSlice"
import { SelectRadio } from "../components/pageBlocks/inputs/SelectRadio"
import { ReviewModal } from "../components/ReviewModal"
import {
	setEditReview,
	setOpenReviewModal,
} from "../store/features/review/reviewSlice"
import { AiFillStar, AiOutlineHeart } from "react-icons/ai"
import { BsStarHalf } from "react-icons/bs"
import { formatPrice, getIntlDate } from "../utils/intl"
import { HashLink } from "react-router-hash-link"
import { selectAuth } from "../store/features/auth/selectors"
import { selectReviews } from "../store/features/review/selectors"
import { ImageVideoViewer } from "../components/ImageVideoViewer"
import { addToCart } from "../store/features/order/thunks"
import { selectOrder } from "../store/features/order/selector"
import { SingleProductSkeleton } from "../components/pageBlocks/Skeletons/SingleProductSkeleton"
import { Link } from "react-router-dom"
import { GrNext } from "react-icons/gr"

export const SingleProduct = () => {
	const { id } = useParams()
	const {
		user: { _id: userId },
	} = useSelector(selectAuth)
	const { singleProduct } = useSelector(selectProducts)
	const { edit } = useSelector(selectReviews)
	const { order } = useSelector(selectOrder)

	const dispatch = useDispatch<AppDispatch>()
	const orderConfigRef = useRef(document.createElement("form"))
	const playerRef = React.useRef(null)

	const [hasReview, setHasReview] = useState(false)

	useEffect(() => {
		if (id) {
			dispatch(getSingleProduct(id))
		}
	}, [id])

	useEffect(() => {
		if (!singleProduct.isLoading) {
			dispatch(setActiveImage(images[0]))
			document.title = `${title?.slice(0, 10)}${
				title?.length > 10 && "..."
			} - OZON`
		}
	}, [singleProduct.images])

	if (singleProduct.isLoading) {
		return <SingleProductSkeleton />
	}

	const {
		title,
		price,
		description,
		images,
		specs,
		tags,
		reviews,
		types,
		averageRating,
		numOfReviews,
		activeImage,
		vendor,
		_id,
		categories,
	} = singleProduct

	const amountFound = order?.items?.filter((i) => i?.product?._id === _id)
	const amount = amountFound?.length === 0 ? 0 : amountFound?.[0]?.amount

	const radioTypes = types?.map((item: string) => {
		return { label: item, value: item.trim() }
	})

	const handleChangeReview = (reviewId: string) => {
		dispatch(setEditReview(reviewId))
		dispatch(setOpenReviewModal(true))
	}

	const handleAddToCart = () => {
		dispatch(
			addToCart({
				productId: _id,
				amount: 1,
				orderId: order._id,
			})
		)
	}

	const handleRemoveFromCart = () => {
		dispatch(
			addToCart({
				productId: _id,
				amount: 0,
				orderId: order._id,
			})
		)
	}

	return (
		<div className="single-product-page">
			<ReviewModal productId={id || ""} />

			<div className="sugar">
				<Link to="/products">Продукты</Link>
				<GrNext />
				<div className="categories">
					{categories?.map((item) => {
						return (
							<Link
								key={item}
								to={`/products?categories=${item}`}
								className="category"
							>
								{item}
							</Link>
						)
					})}
				</div>
			</div>

			<div className="stats">
				<div className="title">{title}</div>
				<div className="substats">
					<div className="reviews">
						<div className="stars">
							{Array.from(Array(Math.floor(averageRating))).map(
								(_, ind) => {
									return <AiFillStar key={ind} />
								}
							)}
							{averageRating !== Math.floor(averageRating) && (
								<BsStarHalf />
							)}
						</div>
						<HashLink to="#reviews" className="numOfReviews">
							{numOfReviews} отзывов
						</HashLink>
					</div>
					<div className="to-favorites">
						<AiOutlineHeart />
						<span>В избранное</span>
					</div>
				</div>
			</div>

			<VerticalScroll images={images} />

			<img
				src={activeImage ? activeImage : defaultImg}
				alt=""
				className="active-image"
			/>

			<div className="info">
				<div className="vendor">
					<img src={vendor?.avatar || defaultImg} alt="" />
					<div className="username">{vendor?.username}</div>
				</div>
				{/* <form className="types" ref={orderConfigRef}>
					<SelectRadio
						name="type"
						title="Тип"
						items={radioTypes}
						onChange={() => {}}
						selected={radioTypes[0].value}
					/>
				</form> */}
				<div className="specs-short">
					{specs
						.slice(0, 3)
						.map(({ title, value, link, _id: specId }) => {
							return (
								<div className="spec" id={specId} key={specId}>
									<div className="title">{title}</div>
									<div className="value">{value}</div>
								</div>
							)
						})}
					<HashLink
						to="#specs-full-wrapper"
						className="btn btn--light"
					>
						Перейти к характеристикам
					</HashLink>
				</div>
			</div>

			<div className="buy-card">
				<div className="price">
					<div className="value">{formatPrice(price)} ₽</div>
					со скидкой
				</div>
				<div className="oldprice">
					<div className="value">
						{formatPrice(Math.floor(price * 1.1))} ₽
					</div>
					старая цена
				</div>
				<div className="credit">
					<span>{formatPrice(Math.floor(price / 6))} ₽</span> &times;
					6 месяцев в FakeOzon Рассрочку
				</div>
				{amount === 0 && (
					<button
						className={
							"btn btn--rounded btn--contained btn--success"
						}
						onClick={handleAddToCart}
					>
						В корзину
					</button>
				)}
				{amount > 0 && (
					<button
						className={"btn btn--rounded btn--contained  btn--warn"}
						onClick={handleRemoveFromCart}
					>
						Убрать из корзины
					</button>
				)}
			</div>

			<div className="description">
				<h3>Описание</h3>
				<div className="text">{description}</div>
			</div>

			<div className="specs-full-wrapper" id="specs-full-wrapper">
				<h3>Характеристики</h3>
				<div className="specs-full">
					{specs.map(({ title, value, link, _id: specID }) => {
						return (
							<div className="spec" id={specID} key={specID}>
								<div className="title">{title}</div>
								<div className="value">{value}</div>
							</div>
						)
					})}
				</div>
			</div>

			<div className="reviews-wrapper" id="reviews">
				<h3>Отзывы</h3>
				{!hasReview && (
					<button
						type="button"
						className="btn btn--rounded btn--contained btn--short btn--content"
						onClick={() => dispatch(setOpenReviewModal(true))}
					>
						Добавить отзыв
					</button>
				)}
				<div className="reviews">
					{reviews.map(
						({
							title,
							comment,
							rating,
							author: { avatar, username, _id: authorID },
							createdAt,
							images,
							videos,
							_id,
						}) => {
							const isCurrentUserReview = authorID === userId
							if (isCurrentUserReview) {
								setHasReview(true)
							}

							return (
								<article
									className={`review-item ${
										isCurrentUserReview ? "active" : ""
									}`}
									id={`review-${_id}`}
									key={_id}
								>
									<div className="title">
										{title}{" "}
										<span className="username">
											от {username}
										</span>
									</div>
									<div className="comment">{comment}</div>
									<div className="rating">
										<div className="date">
											{getIntlDate(createdAt)}
										</div>
										<div className="stars">
											{Array.from(Array(rating)).map(
												(_, ind) => {
													return (
														<AiFillStar key={ind} />
													)
												}
											)}
										</div>
									</div>
									<img
										className="avatar"
										src={avatar || defaultImg}
										alt=""
									/>

									<div className="images-wrapper">
										{images.length > 0 && (
											<ImageVideoViewer
												images={images}
												videos={videos}
											/>
										)}
									</div>

									{authorID === userId && (
										<div
											className="edit-btn btn--light"
											onClick={() =>
												handleChangeReview(_id)
											}
										>
											Изменить
										</div>
									)}
								</article>
							)
						}
					)}
				</div>
			</div>
		</div>
	)
}
