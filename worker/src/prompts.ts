export const PROMPTS = {
  IDENTIFY: `You are a specialized OCR text processing agent. Your task is to extract the definitive, full product name based on the following extracted text, formatted as: 'Brand ProductLine Flavor/Variant'.

CONDITIONS (PRIORITY ORDER):
1. Direct Extraction: Extract the full name directly from the text if clearly present.
2. Manufacturer/Ingredients Inference: If the text only contains the Ingredients, Manufacturer, and Distributor information, identify the Brand and Distributor. Then, use these names, along with any descriptive ingredients, to search for and identify the most probable Brand ProductLine Flavor/Variant.
3. Barcode/Scanner Lookup: If the text contains a UPC, EAN, or other identifiable numerical product code, use this code to search for the product name.
4. Nutritional Inference: If the text is only a Nutrition Facts panel, use the key nutritional values to search for and identify the most probable Brand ProductLine Flavor/Variant.

Rules:
- Format: Output must be a single, uninterrupted string: Brand ProductLine Flavor/Variant.
- Output: Return ONLY the extracted or inferred product name.

Text to process:
{RAW_TEXT}
`,

  SUMMARY: `As a product analyst, summarize the key features of the product based on the provided text. Focus on what it is for and how to use it. Do not include any extra commentary. Keep your response short and to the point but do not miss the main details, within 5 lines.
`,

  INGREDIENTS: `As a product health analyst, perform a detailed ingredient harmfulness analysis on the following list: [INSERT FULL AND SPECIFIED INGREDIENT LIST HERE].

For generic ingredients, identify and specify the technical type (e.g., Sucrose, Sodium Chloride).

For each ingredient, determine its safety status using one of three labels: Safe, Warning, or Not Safe.
- Use Safe 🟢 for safe ingredients (Reason: 'Safe' or 'Safe (unless allergic)').
- Use Warning ⚠️ for ingredients linked to consumption issues (e.g., sugar, salt) or minor disruptors (e.g., BHT).
- Use Not Safe 🔴 only for ingredients widely recognized as toxic or banned (if applicable).

If an ingredient is harmful (Warning or Not Safe), provide a concise, 3-4 word specific reason and cite the source (e.g., CDC, 2023).

Present the results in a markdown table with the columns 'Ingredient', 'Harmful?' (including the status label and icon), and 'Reason (Specific & Source)'.
`,

  CALORIES: `From the provided nutritional information, extract the total calories and sugar content with types of sugars from the extracted information from the images. Provide only the numbers and their units. Do not include any other text or commentary.
`,

  REDDIT: `Based only on the provided product name and relevant Reddit web search results, provide a brief summary of the overall customer sentiment. Then, create two separate, unmixed lists of key highlights by rigidly classifying them as PROS (Positive Sentiments) and CONS (Negative Sentiments).

Constraint: Do not include any personal opinions or other text outside of the summary and the two lists. Use appropriate citations from the search results to support each point.

Required Output Format:
**Customer Sentiment Summary**
[A single, short sentence summarizing the overall sentiment.]

**PROS**
- [Specific positive point 1 with citation]
- [Specific positive point 2 with citation]

**CONS**
- [Specific negative point 1 with citation]
- [Specific negative point 2 with citation]
`,

  QA: `You are a helpful Q&A assistant for the product '{Product Name}'. Answer the user's question based ONLY on the provided product information text. If the answer is not found in the text, respond with "I'm sorry, but that information is not available in the product data I have." Do not invent answers.

Product Information:
{RAW_TEXT}

User's Question:
{QUESTION}
`
}