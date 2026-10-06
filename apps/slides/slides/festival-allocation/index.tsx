import { createDeck, speakerNotes } from "../../components/deck"
import { decks } from "../../content/decks"

const deck = decks.find((deck) => deck.id === "festival-allocation")!
export const meta = {
  title: "The festival plan has an end-to-end capacity gap",
}
export const notes = speakerNotes(deck)
export default createDeck(deck)
