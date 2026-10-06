import { createDeck, speakerNotes } from "../../components/deck"
import { decks } from "../../content/decks"

const deck = decks.find((deck) => deck.id === "service-reliability")!
export const meta = { title: "A small number of delays can disrupt journeys" }
export const notes = speakerNotes(deck)
export default createDeck(deck)
