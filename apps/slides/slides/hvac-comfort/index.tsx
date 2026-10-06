import { createDeck, speakerNotes } from "../../components/deck"
import { decks } from "../../content/decks"

const deck = decks.find((deck) => deck.id === "hvac-comfort")!
export const meta = { title: "Recurring discomfort has a cost" }
export const notes = speakerNotes(deck)
export default createDeck(deck)
