import Link from "next/link"
import { Car, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Car className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-background">Safiri Auto</span>
            </Link>
            <p className="text-background/70 mb-4">
              Your trusted car rental platform across Kenya. Drive like a local, explore like never before.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/vehicles" className="text-background/70 hover:text-primary transition-colors">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-background/70 hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="text-background/70 hover:text-primary transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link href="/payments" className="text-background/70 hover:text-primary transition-colors">
                  Payments
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-background/70 hover:text-primary transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-primary transition-colors">
                  Safety
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-background/70">
                <MapPin className="w-5 h-5 text-primary" />
                Nairobi, Kenya
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <Phone className="w-5 h-5 text-primary" />
                +254 700 000 000
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <Mail className="w-5 h-5 text-primary" />
                hello@safiriauto.co.ke
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center text-background/50">
          <p>&copy; {new Date().getFullYear()} Safiri Auto. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
