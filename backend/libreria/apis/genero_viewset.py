from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.response import Response

from libreria.apis.libro_viewset import LibroSerializer
from libreria.apis.permisos import AllowGetAnyElseAuthenticatedAndPermitted
from libreria.models import Genero, Libro


class GeneroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genero
        fields = '__all__'


class GeneroViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowGetAnyElseAuthenticatedAndPermitted]
    queryset = Genero.objects.all()
    serializer_class = GeneroSerializer

    @action(methods=['get'], detail=True, url_path='libros')
    def getLibroByGenero(self, request, pk):
        genero = self.queryset.get(id=pk)
        libros = Libro.objects.filter(genero=genero).order_by('-ventas')
        libros_serializer = LibroSerializer(libros, many=True)
        serializer = self.get_serializer(genero)

        datos = serializer.data
        datos['libros'] = libros_serializer.data

        print(datos)

        return Response(datos)
