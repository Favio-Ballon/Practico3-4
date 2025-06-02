from django.utils import timezone
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.response import Response

from libreria.apis.libro_viewset import LibroSerializer
from libreria.models import Carrito, Libro, Compra


class CarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carrito
        fields = '__all__'


class CarritoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    queryset = Carrito.objects.all()
    serializer_class = CarritoSerializer

    def get_queryset(self):
        user = self.request.user
        return Carrito.objects.filter(usuario=user)

    @action(detail=False, methods=['post'], url_path='addlibro')
    def add_libro(self, request):
        carrito = Carrito.objects.filter(usuario=request.user).first()
        libro_id = request.data.get('libro_id')
        if not libro_id:
            return Response({'error': 'El ID del libro es requerido'}, status=400)

        try:
            libro = Libro.objects.get(id=libro_id)
            if libro in carrito.libros.all():
                return Response({'error': 'El libro ya está en el carrito'}, status=400)
            carrito.libros.add(libro)
            carrito.precio_total += libro.precio
            carrito.save()
            return Response({'status': 'Libro añadido al carrito'}, status=200)
        except Carrito.DoesNotExist:
            return Response({'error': 'Carrito no encontrado'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    @action(detail=False, methods=['post'], url_path='removelibro')
    def remove_libro(self, request):
        carrito = Carrito.objects.filter(usuario=request.user).first()
        libro_id = request.data.get('libro_id')
        if not libro_id:
            return Response({'error': 'El ID del libro es requerido'}, status=400)

        try:
            libro = Libro.objects.get(id=libro_id)
            if libro not in carrito.libros.all():
                return Response({'error': 'El libro no está en el carrito'}, status=400)
            carrito.libros.remove(libro)
            carrito.precio_total -= libro.precio
            carrito.save()
            return Response({'status': 'Libro eliminado del carrito'}, status=200)
        except Carrito.DoesNotExist:
            return Response({'error': 'Carrito no encontrado'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

#     realizar compra
    @action(detail=False, methods=['post'], url_path='comprar')
    def comprar(self, request):
        carrito = Carrito.objects.filter(usuario=request.user).first()
        if not carrito.libros.exists():
            return Response({'error': 'El carrito está vacío'}, status=400)
        comprobante_pago = request.FILES.get('comprobante_pago')
        if not comprobante_pago:
            return Response({'error': 'El comprobante de pago es requerido'}, status=400)

        compra = Compra.objects.create(
            usuario=request.user,
            fecha = timezone.now(),
            total=carrito.precio_total,
            comprobante_pago=comprobante_pago
        )
        compra.libro.set(carrito.libros.all())
        # agregar una venta a cada libro en el carrito
        for libro in carrito.libros.all():
            libro.ventas += 1
            libro.save()
        compra.save()
        # Por simplicidad, solo vaciaremos el carrito y retornaremos un mensaje de éxito.
        carrito.libros.clear()
        carrito.precio_total = 0.00
        carrito.save()
        return Response({'id': compra.id}, status=200)

    @action(detail=False, methods=['get'], url_path='libros')
    def get_libros(self, request):
        carrito = Carrito.objects.filter(usuario=request.user).first()
        if not carrito:
            return Response({'error': 'Carrito no encontrado'}, status=404)

        libros = carrito.libros.all()
        serializer = LibroSerializer(libros, many=True)
        return Response(serializer.data, status=200)
