from langgraph.graph import StateGraph
from doctors.models import Doctor

def report_node(state):
    state["analysis"] = {
        "summary": "High sugar detected",
        "severity": "medium",
        "doctor_type": "Endocrinologist"
    }
    return state

def triage_node(state):
    state["triage"] = state["analysis"]
    return state

def doctor_node(state):
    docs = Doctor.objects.filter(
        specialization=state["triage"]["doctor_type"]
    )[:3]

    state["doctors"] = list(docs.values())
    return state

def build_graph():
    g = StateGraph(dict)

    g.add_node("report", report_node)
    g.add_node("triage", triage_node)
    g.add_node("doctor", doctor_node)

    g.set_entry_point("report")
    g.add_edge("report", "triage")
    g.add_edge("triage", "doctor")

    return g.compile()

graph = build_graph()

def run_orchestrator():
    return graph.invoke({})