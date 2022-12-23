import React, {
	ChangeEvent,
	FormEvent,
	FormEventHandler,
	useEffect,
	useRef,
	useState,
} from "react"
import { v4 as uuidv4 } from "uuid"

import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../store/store"
import { createProduct, uploadImages } from "../store/features/product/thunks"
import axios from "axios"
import { ozonAPI } from "../axios/customFetch"
import { selectProducts } from "../store/features/product/selectors"

type SpecType = {
	title: string
	value: string
	link: string
	id: string
}

export const CreateNew = () => {
	const formRef = useRef<HTMLFormElement>(null)
	const { creating } = useSelector(selectProducts)
	const { paths: filePaths } = creating
	const dispatch = useDispatch<AppDispatch>()
	const [specs, setSpecs] = useState<SpecType[]>([])

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		let formData = new FormData(formRef.current || undefined)
		for (let i = 0; i < filePaths.length; i++) {
			formData.append("images", filePaths[i])
		}
		formData.set("specs", JSON.stringify(specs))
		dispatch(createProduct(formData))
	}

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files || []

		let formData = new FormData()
		for (let i = 0; i < files.length; i++) {
			formData.append("images", files[i])
		}
		dispatch(uploadImages(formData))
	}

	const handleAddSpec = () => {
		setSpecs((prev) => [
			...prev,
			{
				value: "значение",
				title: "название",
				link: "/ссылка",
				id: uuidv4(),
			},
		])
	}

	const handleRemoveSpec = (id: string) => {
		setSpecs((prev) => prev.filter((spec) => spec.id !== id))
	}

	return (
		<div className="create-new">
			<form
				className="inputs-container"
				onSubmit={handleSubmit}
				ref={formRef}
			>
				<input
					className="input input--rounded"
					type="text"
					placeholder="Введите название"
					name="title"
					required
				/>
				<input
					className="input input--rounded"
					type="text"
					placeholder="Введите описание"
					name="description"
					required
				/>
				<input
					type="number"
					className="input input--rounded"
					placeholder="Введите цену"
					name="price"
					required
				/>
				<div className="specs">
					{specs.map(({ title, value, link, id }, index) => {
						return (
							<div className="spec" key={id} id={id}>
								<input
									type="text"
									defaultValue={title}
									className="input input--rounded "
									placeholder="Введите название"
									required
								/>
								<input
									type="text"
									defaultValue={value}
									className="input input--rounded "
									placeholder="Введите значение"
									required
								/>
								<input
									type="text"
									defaultValue={link}
									className="input input--rounded input--not-required"
									placeholder="Введите ссылку"
								/>
								<div
									className="close"
									onClick={() => handleRemoveSpec(id)}
								>
									&times;
								</div>
							</div>
						)
					})}
				</div>
				<button
					className="btn btn--contained btn--rounded btn--content"
					onClick={handleAddSpec}
					type="button"
				>
					Добавить характеристику
				</button>
				<input
					type="file"
					className="input input--rounded"
					multiple
					name="file"
					accept="image/*"
					onChange={handleFileChange}
					required
				/>
				<button
					className="btn btn--contained btn--rounded btn--tall"
					type="submit"
				>
					Создать
				</button>
			</form>
		</div>
	)
}