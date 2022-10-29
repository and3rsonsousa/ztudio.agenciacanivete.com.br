import { useEffect } from "react";

export default function Layout() {
	useEffect(() => {
		let theme;
		if (localStorage) {
			theme = localStorage.getItem("theme");
		}
		if (theme) {
			document.body.classList.add(theme);
		}
	}, []);

	return <div>Layout</div>;
}
