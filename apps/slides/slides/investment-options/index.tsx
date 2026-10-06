import { createDeck, speakerNotes } from "../../components/deck"
import { decks } from "../../content/decks"

const deck = decks.find((deck) => deck.id === "investment-options")!
export const meta = {
  title: "Maintenance spending is broader than repair bills",
}
export const notes = speakerNotes(deck)
export default createDeck(deck)
