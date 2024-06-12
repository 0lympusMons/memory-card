const DECK_API_BASE = "https://www.deckofcardsapi.com/api/deck";

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function fetchDeckID() {
  try {
    const url = `${DECK_API_BASE}/new/shuffle/`;
    const data = await fetchJson(url);
    return data.deck_id;
  } catch (error) {
    console.error("Error fetching deck ID:", error);
  }
}

export async function drawCards(deckID) {
  try {
    const url = `${DECK_API_BASE}/${deckID}/draw/?count=10`;
    const data = await fetchJson(url);
    return data.cards;
  } catch (error) {
    console.error("Error drawing cards:", error);
  }
}
