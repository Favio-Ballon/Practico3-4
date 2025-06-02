from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions

from libreria.apis.permisos import AllowGetAnyElseAuthenticatedAndPermitted
from libreria.models import Libro

# libreria/permissions.py

# libreria/permissions.py

class LibroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Libro
        fields = '__all__'


class LibroViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowGetAnyElseAuthenticatedAndPermitted]
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer


    def get_queryset(self):
        return Libro.objects.order_by('-ventas')