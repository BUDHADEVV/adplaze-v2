import { defineField, defineType } from 'sanity'

export const booking = defineType({
    name: 'booking',
    title: 'Booking',
    type: 'document',
    fields: [
        defineField({
            name: 'space',
            title: 'Ad Space',
            type: 'reference',
            to: [{ type: 'adSpace' }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'advertiser',
            title: 'Advertiser',
            type: 'reference',
            to: [{ type: 'user' }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'startDate',
            title: 'Start Date',
            type: 'date',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'endDate',
            title: 'End Date',
            type: 'date',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Pending', value: 'pending' },
                    { title: 'Confirmed', value: 'confirmed' },
                    { title: 'Rejected', value: 'rejected' },
                    { title: 'Completed', value: 'completed' },
                ],
            },
            initialValue: 'pending',
        }),
        defineField({
            name: 'totalPrice',
            title: 'Total Price',
            type: 'number',
        })
    ],
    preview: {
        select: {
            title: 'space.title',
            subtitle: 'status',
        },
    },
})
