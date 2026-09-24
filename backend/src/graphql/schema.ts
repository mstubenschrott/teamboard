interface Book {
	id: string
	title: string
}

const books: Book[] = [
	{ id: "1", title: "The Awakening" },
	{ id: "2", title: "City of Glass" },
]

export const typeDefs = `#graphql
	type Book {
		id: ID!
		title: String!
	}

	type Query {
		books: [Book!]
	}

	type Mutation {
		addBook(title: String!): Book
	}
`

export const resolvers = {
	Query: {
		books: () => books,
	},
	Mutation: {
		addBook: (_parent: unknown, args: { title: string }) => {
			const book: Book = { id: String(books.length + 1), title: args.title }
			books.push(book)
			return book
		},
		/*addDefaultBook: (_parent: unknown) => {
			const book: Book = { id: String(books.length + 1), title: "bla" }
			books.push(book)
			return book
		},*/
	},
}
