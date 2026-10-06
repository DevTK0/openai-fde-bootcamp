import { createDeck, speakerNotes } from "../../components/deck"
import { decks } from "../../content/decks"

const deck = decks.find((deck) => deck.id === "capacity-use")!
export const meta = {
  title: "Bus use varies sharply at the same departure",
}
export const notes = speakerNotes(deck)
export default createDeck(deck)
