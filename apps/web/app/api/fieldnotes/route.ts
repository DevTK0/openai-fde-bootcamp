import { commandSchema } from "@/lib/fieldnotes/schema"
import { withStore } from "@/lib/fieldnotes/store"
import { generateSpecification } from "@/lib/fieldnotes/openai"
import { owner, readBody, failure } from "@/lib/fieldnotes/http"

export const runtime = "nodejs"
export async function GET(request: Request) {
  try {
    const who = await owner()
    const id = new URL(request.url).searchParams.get("id")
    const result = withStore((store) =>
      id ? store.get(who, id) : store.list(who)
    )
    return Response.json(result, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    return failure(error)
  }
}
export async function POST(request: Request) {
  try {
    const command = commandSchema.parse(await readBody(request))
    const who = await owner()
    if (command.kind === "generate") {
      const chat = withStore((store) => store.get(who, command.id))
      if (chat.revision === chat.specRevision) return Response.json(chat)
      const specification = await generateSpecification(chat)
      return Response.json(
        withStore((store) =>
          store.saveSpecification(who, chat.id, chat.revision, specification)
        )
      )
    }
    const chat = withStore((store) => {
      switch (command.kind) {
        case "create":
          return store.create(who)
        case "rename":
          return store.rename(who, command.id, command.name)
        case "append":
          return store.append(who, command.id, command.events)
        case "end":
          return store.end(who, command.id)
      }
    })
    return Response.json(chat)
  } catch (error) {
    return failure(error)
  }
}
