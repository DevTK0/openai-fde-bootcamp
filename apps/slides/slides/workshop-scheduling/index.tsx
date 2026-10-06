import { createDeck, speakerNotes } from "../../components/deck"
import { decks } from "../../content/decks"

const deck = decks.find((deck) => deck.id === "workshop-scheduling")!
export const meta = {
  title: "Workshop bookings conflict with available resources",
}
export const notes = speakerNotes(deck)
export default createDeck(deck)
