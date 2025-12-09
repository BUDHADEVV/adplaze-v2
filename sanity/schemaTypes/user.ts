import { defineField, defineType } from 'sanity'
import { UserIcon } from 'lucide-react'

export const user = defineType({
    name: 'user',
    title: 'User',
    type: 'document',
    icon: UserIcon as any,
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
            validation: (Rule) => Rule.required().email(),
        }),
        defineField({
            name: 'phone',
            title: 'Phone Number',
            type: 'string',
        }),
        defineField({
            name: 'image',
            title: 'Profile Image',
            type: 'url',
        }),
        defineField({
            name: 'role',
            title: 'Role',
            type: 'string',
            options: {
                list: [
                    { title: 'Advertiser', value: 'advertiser' }, // Default
                    { title: 'Agency (Space Owner)', value: 'agency' },
                    { title: 'Admin', value: 'admin' },
                ]
            },
            initialValue: 'advertiser',
        }),
        defineField({
            name: 'username',
            title: 'Username',
            type: 'string',
            description: 'For Agency Manual Login'
        }),
        defineField({
            name: 'password',
            title: 'Password',
            type: 'string',
            description: 'Simple password for MVP (stored as is or hashed if implemented)',
            hidden: false,
        }),
        defineField({
            name: 'agencyProfile',
            title: 'Agency Profile',
            type: 'object',
            hidden: ({ parent }) => parent?.role !== 'agency',
            fields: [
                defineField({ name: 'companyName', type: 'string', title: 'Company Name' }),
                defineField({ name: 'website', type: 'url', title: 'Website' }),
            ]
        })
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'role',
        },
    },
})
