import { groq } from 'next-sanity'

export const ALL_SPACES_QUERY = groq`
  *[_type == "adSpace"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    type,
    price,
    images,
    address,
    dimensions,
    "imageUrl": images[0].asset->url
  }
`

export const SPACE_BY_SLUG_QUERY = groq`
  *[_type == "adSpace" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    type,
    price,
    images,
    description,
    address,
    dimensions,
    location,
    demographics,
    availability,
    owner->{name, email, phone, agencyProfile},
    "imageUrls": images[].asset->url
  }
`
