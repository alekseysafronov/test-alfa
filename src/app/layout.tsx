import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Продуктовый каталог",
  description: "Каталог продуктов с возможностью добавления в избранное",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <Link href="/products" className="text-xl font-bold">
                Продуктовый каталог
              </Link>
              <div className="flex gap-4">
                <Link
                  href="/products"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Продукты
                </Link>
                <Link
                  href="/create-product"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Создать продукт
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
