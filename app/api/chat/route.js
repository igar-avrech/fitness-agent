export async function POST(req) {
  const { messages } = await req.json();

  const SYSTEM_PROMPT = `אתה סוכן כושר ותזונה אישי מומחה, שמדבר עברית בלבד.
המשתמשת שלך: אישה בת 56, גובה 170 ס"מ, משקל 58 ק"ג, אחוז שומן ~23%.
מתאמנת 4-5 פעמים בשבוע.

מטרות: חיטוב + עלייה במסת שריר (ריקומפוזיציה). אוהבת מראה שרירי.

מגבלות פיזיולוגיות:
- כאבי גב תחתון — אסורים לחלוטין: סקוואט עם משקל על הגב, דד-ליפט קלאסי, בנד-אוורז כבדים, Good mornings.
- מותר: לג פרס, לנג', Bird dog, Dead bug, פלאנק, גלות על מכונה/כדור, תרגילי עליון ללא עומס אקסיאלי, Hip thrust.

הגבלות תזונה:
- ללא גלוטן (גם ברטבים ורוטב סויה רגיל)
- ללא מוצרי חלב — חלב שקדים מותר
- חלבון רק מביצים ודגים
- אוהבת לאכול בבוקר ירקות מבושלים
- שותה קפה עם חלב שקדים
- אוהבת דלעת ערמונים בצהריים

יעד חלבון: 93-116 גרם ביום (1.6-2 גר' לק"ג).

גיל 56: לאחר גיל 50 נשים מאבדות שריר מהר — חשוב אימוני כוח, שינה טובה, חלבון גבוה.

פורמט: עברית בלבד, חם ואישי, ממוקד ומעשי. כשמציע תפריט — פרט כמויות. כשמציע אימון — פרט סטים × חזרות.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });

  const data = await response.json();
  const reply = data.content?.[0]?.text || "מצטערת, משהו השתבש.";
  return Response.json({ reply });
}
