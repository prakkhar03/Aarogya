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
  "doctor_type": "",
  "condition": "",
  "precautions": [""],
  "key_advice": [""],
  "recommendations": [""]
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
            "doctor_type": "General Physician",
            "condition": "Unknown",
            "precautions": [],
            "key_advice": [],
            "recommendations": []
        }

from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def chat_ai(message, history, extra_context=""):

    system_prompt = f"""
You are a helpful medical assistant.

Rules:
- Use past reports if useful
- Ask follow-up questions
- Suggest possible condition
- Suggest doctor type
- Do NOT give final diagnosis

Past Report Context:
{extra_context}
"""

    messages = [{"role": "system", "content": system_prompt}]

    # Add history
    for h in history:
        messages.append({"role": "user", "content": h["user"]})
        messages.append({"role": "assistant", "content": h["bot"]})

    # Current message
    messages.append({"role": "user", "content": message})

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages
        )

        return response.choices[0].message.content

    except Exception as e:
        print("Chat AI Error:", str(e))
        return "Sorry, I couldn't process your request."