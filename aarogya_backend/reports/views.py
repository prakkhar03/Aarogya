from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Report
from agents.orchestrator import run_orchestrator
from .utils import extract_text_from_pdf

class UploadReportView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES.get("file")

        if not file:
            return Response({"error": "file required"}, status=400)

        report = Report.objects.create(
            user=request.user,
            file=file
        )

        text = extract_text_from_pdf(file)
        report.extracted_text = text

        result = run_orchestrator({
            "report_text": text
        })

        report.analysis = result
        report.save()

        return Response({
            "report_id": report.id,
            "analysis": result
        })


class ReportListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reports = Report.objects.filter(user=request.user)
        return Response(list(reports.values()))