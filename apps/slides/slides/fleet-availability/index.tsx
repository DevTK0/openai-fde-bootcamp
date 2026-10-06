import { createDeck, speakerNotes } from "../../components/deck"
import { decks } from "../../content/decks"

const deck = decks.find((deck) => deck.id === "fleet-availability")!
export const meta = {
  title: "Workshop estimates do not establish usable buses",
}
export const notes = speakerNotes(deck)
export default createDeck(deck)
