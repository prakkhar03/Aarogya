from groq import Groq
import os
import json

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def call_ai(text):

    prompt = f"""
You are a medical AI.

Analyze the report and return ONLY JSON:

{{
  "summary": "",
  "severity": "",
  "doctor_type": ""
}}

Report:
{text[:2000]}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",   # ✅ CURRENT MODEL
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        output = response.choices[0].message.content

        start = output.find("{")
        end = output.rfind("}") + 1

        return json.loads(output[start:end])

    except Exception as e:
        print("Groq Error:", str(e))
        return {
            "summary": "Could not analyze report",
            "severity": "unknown",
            "doctor_type": "General Physician"
        }