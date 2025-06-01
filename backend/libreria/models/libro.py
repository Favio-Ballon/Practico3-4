from django.db import models


class Libro(models.Model):
    titulo = models.CharField(max_length=100)
    autor = models.CharField(max_length=100)
    descripcion = models.TextField()
    isbn = models.CharField(max_length=20, unique=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    imagen = models.ImageField(upload_to='libros/')
    genero = models.ManyToManyField('libreria.Genero', related_name='libros')
    ventas = models.IntegerField(default=0)