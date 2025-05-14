type FooterLink = {
  title: string
  items: {
    name: string
    link?: string
    icon?: string
  }[]
}

type TopLink = {
  name: string
  link?: string
}

const footerLinks: FooterLink[] = [
  {
    title: 'Page',
    items: [
      { name: 'About us', link: '/pages/about' },
      { name: 'Contact us', link: '/pages/contact' },
      { name: 'News and Blog', link: '/blogs/blog' },
      { name: 'Meet a Team', link: '/pages/our-team' },
    ],
  },
  {
    title: 'Link',
    items: [
      { name: 'Sign up', link: '/auth/sign-up' },
      { name: 'Sign in', link: '/auth/sign-in' },
      { name: 'Privacy Policy', link: '/help/privacy-policy' },
      { name: 'Terms', link: '/help/service' },
      { name: 'Cookie', link: '/' },
      { name: 'Support', link: '/help/center' },
    ],
  },
  {
    title: 'Global Site',
    items: [
      { name: 'India', link: '/' },
      { name: 'California', link: '/' },
      { name: 'Indonesia', link: '/' },
      { name: 'Canada', link: '/' },
      { name: 'Malaysia', link: '/' },
    ],
  },
  {
    title: 'Booking',
    items: [
      { name: 'Hotel', icon: 'fa-hotel', link: '/hotels/home' },
      { name: 'Flight', icon: 'fa-plane', link: '/flights/home' },
      { name: 'Tour', icon: 'fa-earth-americas', link: '/tours/home' },
      { name: 'Cabs', icon: 'fa-car', link: '/cabs/home' },
    ],
  },
]

const topLinks: TopLink[] = [
  { name: 'Flights', link: '/flights/home' },
  { name: 'Hotels', link: '/hotels/home' },
  { name: 'Tours', link: '/tours/home' },
  { name: 'Cabs', link: '/cabs/home' },
  { name: 'About', link: '/pages/about' },
  { name: 'Contact us', link: '/pages/contact' },
  { name: 'Blogs', link: '/blogs/blog' },
  { name: 'Services', link: '/help/service' },
  { name: 'Detail page', link: '/directories/detail' },
  { name: 'Policy', link: '/help/privacy-policy' },
  { name: 'Testimonials', link: '/hotels/home#hotels-home-testimonial' },
  { name: 'Newsletters', link: '/blogs/detail' },
  { name: 'Podcasts', link: '/' },
  { name: 'Protests', link: '/' },
  { name: 'NewsCyber', link: '/' },
  { name: 'Education', link: '/' },
  { name: 'Sports', link: '/' },
  { name: 'Tech and Auto', link: '/' },
  { name: 'Opinion', link: '/' },
  { name: 'Share Market', link: '/' },
]

export const footer2Link: TopLink[] = [
  {
    name: 'About',
    link: '/pages/about',
  },
  {
    name: 'Terms',
    link: '/help/service',
  },
  {
    name: 'Privacy',
    link: '/help/privacy-policy',
  },
  {
    name: 'Career',
    link: '/',
  },
  {
    name: 'Contact us',
    link: '/pages/contact',
  },
  {
    name: 'Cookies',
    link: '/',
  },
]
export const footer3Link: TopLink[] = [
  {
    name: 'About',
    link: '/pages/about',
  },
  {
    name: 'Policy',
    link: '/help/privacy-policy',
  },
  {
    name: 'Terms & Condition',
    link: '/help/service',
  },
]

const footer4Link: FooterLink[] = [
  {
    title: 'Page',
    items: [
      { name: 'About us', link: '/pages/about' },
      { name: 'Contact us', link: '/pages/contact' },
      { name: 'News and Blog', link: '/blogs/blog' },
      { name: 'Meet a Team', link: '/pages/our-team' },
    ],
  },
  {
    title: 'Link',
    items: [
      { name: 'Sign up', link: '/auth/sign-up' },
      { name: 'Sign in', link: '/auth/sign-in' },
      { name: 'Privacy Policy', link: '/help/privacy-policy' },
      { name: 'Terms', link: '/help/service' },
      { name: 'Cookie', link: '/' },
      { name: 'Support', link: '/help/center' },
    ],
  },
]

export { footerLinks, topLinks, footer4Link }
