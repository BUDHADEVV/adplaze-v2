import { defineField, defineType } from 'sanity'
import { MapPin } from 'lucide-react'

export const adSpace = defineType({
    name: 'adSpace',
    title: 'Ad Space',
    type: 'document',
    icon: MapPin as any, // Type cast for Lucide icon
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'type',
            title: 'Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Billboard', value: 'billboard' },
                    { title: 'Digital Screen', value: 'digital_screen' },
                    { title: 'Transit Ad', value: 'transit' },
                    { title: 'Other', value: 'other' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
            validation: (Rule) => Rule.warning('Images are recommended'),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'location',
            title: 'Location Coordinates',
            type: 'geopoint',
        }),
        defineField({
            name: 'city',
            title: 'City / Town',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'district',
            title: 'District / State',
            type: 'string',
        }),
        defineField({
            name: 'address',
            title: 'Specific Spot / Landmark',
            type: 'string',
        }),
        defineField({
            name: 'price',
            title: 'Price (Daily)',
            type: 'number',
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: 'dimensions',
            title: 'Dimensions (e.g. 20x10 ft)',
            type: 'string',
        }),
        defineField({
            name: 'owner',
            title: 'Agency / Owner',
            type: 'reference',
            to: [{ type: 'user' }],
        }),
        defineField({
            name: 'availability',
            title: 'Blocked Dates',
            type: 'array',
            description: 'Dates when this space is NOT available',
            of: [{ type: 'date' }], // Simplified availability: just list of fully booked dates
        }),
        defineField({
            name: 'demographics',
            title: 'Target Demographics',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Students', value: 'students' },
                    { title: 'Professionals', value: 'professionals' },
                    { title: 'Families', value: 'families' },
                    { title: 'Tourists', value: 'tourists' },
                    { title: 'Gen Z', value: 'gen_z' },
                    { title: 'High Net Worth', value: 'hnw' },
                ]
            }
        })
    ],
})
