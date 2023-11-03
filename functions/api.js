export function onRequest(context) {
    return new Response(JSON.stringify({
      data: 1
    }))
  }