import { createDeck, speakerNotes } from "../../components/deck"
import { decks } from "../../content/decks"

const deck = decks.find((deck) => deck.id === "customer-growth")!
export const meta = { title: "Boarding counts do not explain customer growth" }
export const notes = speakerNotes(deck)
export default createDeck(deck)
