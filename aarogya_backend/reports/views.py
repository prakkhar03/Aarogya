from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Report
from agents.orchestrator import run_orchestrator

class UploadReportView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        report = Report.objects.create(user=request.user)

        result = run_orchestrator()

        report.analysis = result
        report.save()

        return Response({
            "report_id": report.id,
            "data": result
        })


class ReportListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reports = Report.objects.filter(user=request.user)
        return Response(list(reports.values()))