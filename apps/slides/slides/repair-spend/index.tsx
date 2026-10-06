import { createDeck, speakerNotes } from "../../components/deck"
import { decks } from "../../content/decks"

const deck = decks.find((deck) => deck.id === "repair-spend")!
export const meta = { title: "Repair costs are rising faster than use" }
export const notes = speakerNotes(deck)
export default createDeck(deck)
