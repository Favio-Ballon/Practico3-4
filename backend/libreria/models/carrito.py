from django.db import models


class carrito(models.Model):
    libro = models.ForeignKey('libreria.Libro', on_delete=models.CASCADE)
    precio_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Carrito {self.id} - Libro: {self.libro.titulo} - Cantidad: {self.cantidad}"