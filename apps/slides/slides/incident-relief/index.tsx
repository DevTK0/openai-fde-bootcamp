import { createDeck, speakerNotes } from "../../components/deck"
import { decks } from "../../content/decks"

const deck = decks.find((deck) => deck.id === "incident-relief")!
export const meta = {
  title: "The disruption plan cannot clear the assumed queue",
}
export const notes = speakerNotes(deck)
export default createDeck(deck)
