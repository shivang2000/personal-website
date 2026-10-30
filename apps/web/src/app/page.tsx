import { productFonts } from "@/variants/product/font";
import { ProductPage } from "@/variants/product/product-page";

/**
 * Homepage — the "Product" variant, Shivang's pick after the design review.
 * The other directions (Swiss, Editorial, Console) live under /lab.
 */
export default function Home() {
	return (
		<div className={productFonts}>
			<ProductPage />
		</div>
	);
}
