// /src/api/drugApi.js
export async function fetchDrugNames(limit = 10) {
  try {
    const res = await fetch(
      "https://dailymed.nlm.nih.gov/dailymed/services/v2/drugnames.json?pagesize=100"
    );
    const json = await res.json();

    return json.data.drugNames
      .slice(0, limit)
      .map(d => ({ name: d }));
  } catch (err) {
    console.error("Drug API error", err);
    return [];
  }
}