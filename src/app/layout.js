import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "B.R Bakery, Ice Cream Parlour & Cafe - Delicious Food & Ice Cream",
  description: "Welcome to B.R Bakery, Ice Cream Parlour & Cafe in Kotekar, Beeri. Enjoy our daily fresh milkshakes, crispy dosas, and flavorful ice cream.",
  keywords: ["cafe near me", "local ice cream parlour", "dosa", "milkshake", "B.R cafe", "Ullal", "Beeri", "Kotekar", "Karnataka"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
            {/* We'll update Navbar and Footer to be server-compatible or mark them as client components */}
            <Navbar />
            <main style={{ flexGrow: 1 }}>
              {children}
            </main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
