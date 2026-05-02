/**
 * Footer Component
 * Site footer with links and information
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { Building, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  // Footer link sections
  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { label: 'Home', to: '/' },
        { label: 'Properties', to: '/properties' },
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Saved Properties', to: '/saved' },
      ],
    },
    {
      title: 'Property Types',
      links: [
        { label: 'Houses', to: '/properties?type=house' },
        { label: 'Apartments', to: '/properties?type=apartment' },
        { label: 'Villas', to: '/properties?type=villa' },
        { label: 'Condos', to: '/properties?type=condo' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', to: '#' },
        { label: 'FAQs', to: '#' },
        { label: 'Privacy Policy', to: '#' },
        { label: 'Terms of Service', to: '#' },
      ],
    },
  ]

  // Social media links
  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                RealEstate<span className="text-primary-400">Pro</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Your trusted partner in finding the perfect property. We offer a wide range of 
              real estate options with advanced analytics and insights to help you make 
              informed decisions.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span>123 Real Estate Ave, New York, NY 10001</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-primary-400" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary-400" />
                <span>info@realestatepro.com</span>
              </div>
            </div>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-500">
              {currentYear} RealEstatePro. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-primary-600 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
