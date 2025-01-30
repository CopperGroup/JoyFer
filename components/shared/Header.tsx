"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import Auth from "./Auth"
import AdminLink from "./AdminLink"
import { TransitionLink } from "../interface/TransitionLink"
import { usePathname } from "next/navigation"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"
import BurgerMenu from "./BurgerMenu"
import { trackFacebookEvent } from "@/helpers/pixel"
import { Store } from "@/constants/store"

const Links = [
  { label: "Головна", href: "/" },
  { label: "Каталог", href: "/catalog" },
  { label: "Уподобані", href: "/liked" },
  { label: "Мої замовлення", href: "/myOrders" },
  { label: "Інформація", href: "/info" },
]

const infoNames = ["Контакти", "Доставка та оплата", "Гаратнія та сервіси", "Презентації"]

export default function Header({ email, user }: { email: string; user: string }) {
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement>(null)
  const isInView = useInView(headerRef, { once: true, amount: 0.3 })

  const userInfo = JSON.parse(user)

  const handleLead = (label: string) => {
    trackFacebookEvent("Lead", {
      lead_type: label,
    })
  }

  return (
    <header
      ref={headerRef}
      className="w-full min-w-[320px] flex justify-center items-center bg-yellow-400 py-4 relative overflow-hidden"
    >
      <div className="w-full max-w-[1680px] flex justify-between items-center px-12 max-lg:px-9 max-[500px]:px-7 relative z-10">
        <div
        >
          <Link href="/" className="w-fit flex gap-2 justify-center items-center">
            <p className="text-base-semibold text-black">{Store.name}</p>
          </Link>
        </div>
        <nav
          className="w-fit flex gap-4 justify-center items-center max-lg:hidden"
        >
          <AdminLink />
          {Links.map(({ label, href }, index) => {
            const isActive = (pathname.includes(href) && href.length > 1) || pathname === href

            if (["Уподобані", "Мої замовлення"].includes(label)) {
              if (!email) return null

              return (
                <div
                  key={label}
                >
                  <TransitionLink
                    href={`${href}${label === "Уподобані" ? "/" + userInfo?._id : ""}`}
                    className={`text-small-medium font-normal hover:text-gray-800 transition-all ${isActive ? "text-gray-800 font-semibold" : "text-gray-600"}`}
                    onClick={() => handleLead(label)}
                  >
                    {label}
                  </TransitionLink>
                </div>
              )
            } else if (label === "Інформація") {
              return (
                <div
                  key={label}
                >
                  <Menubar className="border-0 p-0 space-x-0 bg-transparent">
                    <MenubarMenu>
                      <MenubarTrigger
                        className={`text-[14px] p-0 font-normal mt-0.5 cursor-pointer ${isActive ? "text-gray-800 font-semibold" : "text-gray-600"}`}
                      >
                        {label}
                      </MenubarTrigger>
                      <MenubarContent className="min-w-[9rem] bg-white text-gray-600 border rounded-lg shadow-lg">
                        {["contacts", "delivery-payment", "warranty-services", "presentations"].map(
                          (subItem, index) => (
                            <MenubarItem
                              key={subItem}
                              className="text-small-medium font-normal cursor-pointer hover:text-gray-800 transition-all"
                            >
                              <TransitionLink href={`/info/${subItem}`} onClick={() => handleLead(`/info/${subItem}`)}>
                                {infoNames[index]
                                  .split("-")
                                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                  .join(" ")}
                              </TransitionLink>
                            </MenubarItem>
                          ),
                        )}
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                </div>
              )
            } else {
              return (
                <div
                  key={label}
                >
                  <TransitionLink
                    href={href}
                    className={`text-small-medium font-normal hover:text-gray-800 transition-all ${isActive ? "text-gray-800 font-semibold" : "text-gray-600"}`}
                  >
                    {label}
                  </TransitionLink>
                </div>
              )
            }
          })}
        </nav>
        <div
          className="w-fit flex justify-center items-center max-lg:hidden"
        >
          <Auth email={email} user={user} />
        </div>
        <div
          className="w-fit h-8 hidden mt-1 max-lg:flex"
        >
          <BurgerMenu email={email} user={user} />
        </div>
      </div>
    </header>
  )
}

