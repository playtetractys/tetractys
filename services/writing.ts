export function getContentFromText(text: string) {
  return { content: [{ content: [{ text, type: "text" }], type: "paragraph" }], type: "doc" };
}
