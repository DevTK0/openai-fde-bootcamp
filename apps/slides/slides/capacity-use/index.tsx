import { createDeck, speakerNotes } from "../../components/deck"
import { decks } from "../../content/decks"

const deck = decks.find((deck) => deck.id === "capacity-use")!
export const meta = {
  title: "The same bus is full on some days and mostly empty on others",
}
export const notes = speakerNotes(deck)
export default createDeck(deck)
