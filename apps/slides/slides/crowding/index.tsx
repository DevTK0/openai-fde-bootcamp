import { createDeck, speakerNotes } from "../../components/deck"
import { decks } from "../../content/decks"

const deck = decks.find((deck) => deck.id === "crowding")!
export const meta = { title: "Some passengers cannot board the bus they need" }
export const notes = speakerNotes(deck)
export default createDeck(deck)
