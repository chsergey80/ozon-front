import React, { useEffect } from "react"
import imgNotAllowed from "./../assets/images/notAllowed.jpg"
import { Link } from "react-router-dom"

export const NotAllowed = () => {
	useEffect(() => {
		document.title = "Доступ запрещен - OZON"
	}, [])

	return (
		<div className="not-allowed-page">
			<h1>Вход только для авторизированных пользователей</h1>
			<Link to="/">Вернуться на Главную</Link>
			<img src={imgNotAllowed} alt="" />
		</div>
	)
}
