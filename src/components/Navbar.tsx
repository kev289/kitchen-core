"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@heroui/react/button";
import { Menu, X, Heart, LogOut, User, ChefHat } from "lucide-react";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-gray-900 cursor-pointer">
          <ChefHat className="w-6 h-6" />
          GourmetDev
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2 text-sm">
          {loading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin ml-2" />
          ) : user ? (
            <>
              <Link
                href="/"
                className="px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Recetas
              </Link>
              <Link
                href="/crear"
                className="px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Crear
              </Link>
              <Link
                href="/favorites"
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                title="Favoritos"
              >
                <Heart className="w-5 h-5" />
              </Link>
              <span className="text-gray-200 mx-1">|</span>
              <div className="flex items-center gap-1.5 px-2 py-1 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span className="font-medium text-gray-800">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link href="/login" className="cursor-pointer">
                <Button variant="ghost" size="sm" className="text-gray-700 cursor-pointer">
                  Entrar
                </Button>
              </Link>
              <Link href="/register" className="cursor-pointer">
                <Button size="sm" className="bg-gray-900 text-white rounded-full px-5 cursor-pointer">
                  Registrarse
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        {user && (
          <button
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        )}
      </div>

      {/* Mobile menu (solo cuando hay sesión) */}
      {menuOpen && user && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md px-4 py-4 space-y-1 text-sm">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <ChefHat className="w-5 h-5" />
            Recetas
          </Link>
          <Link
            href="/crear"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <ChefHat className="w-5 h-5" />
            Crear receta
          </Link>
          <hr className="my-2 border-gray-100" />
          <Link
            href="/favorites"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <Heart className="w-5 h-5" />
            Favoritos
          </Link>
          <div className="flex items-center gap-3 px-3 py-2.5 text-gray-500">
            <User className="w-5 h-5" />
            {user.name}
          </div>
          <button
            onClick={() => { logout(); setMenuOpen(false); }}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}
