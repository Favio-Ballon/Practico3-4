from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.response import Response

from libreria.apis.libro_viewset import LibroSerializer
from libreria.models import Compra, Libro


class CompraSerializer(serializers.ModelSerializer):
    libro = LibroSerializer(many=True, read_only=True)  # Mostramos detalles completos

    class Meta:
        model = Compra
        fields = ['id', 'fecha', 'total', 'libro', 'usuario', 'comprobante_pago']


class CompraViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    serializer_class = CompraSerializer

    def get_queryset(self):
        return Compra.objects.filter(usuario=self.request.user).order_by('-fecha')

    @action(detail=False, methods=['get'], url_path='admin')
    def get_all_compras(self, request):
        if not request.user.is_staff:
            return Response({'error': 'No tienes permiso para ver todas las compras'}, status=403)

        compras = Compra.objects.all().order_by('-fecha')
        serializer = self.get_serializer(compras, many=True)
        return Response(serializer.data)