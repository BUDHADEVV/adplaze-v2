import { defineField, defineType } from 'sanity'
import { Star } from 'lucide-react'

export const review = defineType({
    name: 'review',
    title: 'Review',
    type: 'document',
    icon: Star as any,
    fields: [
        defineField({
            name: 'rating',
            title: 'Rating (1-5)',
            type: 'number',
            validation: (Rule) => Rule.required().min(1).max(5),
        }),
        defineField({
            name: 'comment',
            title: 'Comment',
            type: 'text',
        }),
        defineField({
            name: 'user',
            title: 'User',
            type: 'reference',
            to: [{ type: 'user' }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'space',
            title: 'Ad Space',
            type: 'reference',
            to: [{ type: 'adSpace' }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'createdAt',
            title: 'Created At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
    ],
    preview: {
        select: {
            title: 'comment',
            subtitle: 'rating',
        },
        prepare(selection) {
            const { title, subtitle } = selection
            return {
                title: title || 'No comment',
                subtitle: `${subtitle} Stars`,
            }
        }
    },
})
