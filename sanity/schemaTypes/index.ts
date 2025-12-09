import { type SchemaTypeDefinition } from 'sanity'
import { user } from './user'
import { adSpace } from './adSpace'
import { booking } from './booking'
import { review } from './review'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [user, adSpace, booking, review],
}
